/**
 * Mobile Gesture Handlers for Coffee Vault
 * Version: 1.0.0
 * Purpose: Touch gesture recognition and handling for mobile interactions
 *
 * Supported Gestures:
 * - Swipe (left, right, up, down)
 * - Long press
 * - Pinch to zoom
 * - Pull to refresh
 * - Double tap
 * - Drag and drop
 */

(function() {
  'use strict';

  // ============================================
  // GESTURE DETECTOR BASE CLASS
  // ============================================

  class GestureDetector {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        threshold: 50, // Minimum distance for swipe
        timeout: 300, // Maximum time for swipe
        longPressDelay: 500, // Time to trigger long press
        ...options
      };

      this.touchState = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        startTime: 0,
        endTime: 0,
        isMoving: false,
        lastTap: 0
      };

      this.init();
    }

    init() {
      // Prevent context menu on long press
      this.element.addEventListener('contextmenu', (e) => {
        if (this.touchState.isLongPress) {
          e.preventDefault();
        }
      });
    }

    getDistance() {
      return Math.sqrt(
        Math.pow(this.touchState.endX - this.touchState.startX, 2) +
        Math.pow(this.touchState.endY - this.touchState.startY, 2)
      );
    }

    getDirection() {
      const deltaX = this.touchState.endX - this.touchState.startX;
      const deltaY = this.touchState.endY - this.touchState.startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'right' : 'left';
      } else {
        return deltaY > 0 ? 'down' : 'up';
      }
    }

    getVelocity() {
      const distance = this.getDistance();
      const time = this.touchState.endTime - this.touchState.startTime;
      return distance / time;
    }
  }

  // ============================================
  // SWIPE GESTURE HANDLER
  // ============================================

  class SwipeHandler extends GestureDetector {
    constructor(element, options = {}) {
      super(element, options);
      this.callbacks = {
        onSwipeLeft: options.onSwipeLeft || null,
        onSwipeRight: options.onSwipeRight || null,
        onSwipeUp: options.onSwipeUp || null,
        onSwipeDown: options.onSwipeDown || null
      };

      this.setupListeners();
    }

    setupListeners() {
      this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
      const touch = e.touches[0];
      this.touchState.startX = touch.clientX;
      this.touchState.startY = touch.clientY;
      this.touchState.startTime = Date.now();
      this.touchState.isMoving = false;

      this.element.classList.add('gesture-active');
    }

    handleTouchMove(e) {
      if (!this.touchState.startX) return;

      this.touchState.isMoving = true;
      const touch = e.touches[0];
      this.touchState.endX = touch.clientX;
      this.touchState.endY = touch.clientY;

      // Prevent default scroll for certain swipe directions if needed
      const direction = this.getDirection();
      if ((direction === 'left' || direction === 'right') && this.options.preventHorizontalScroll) {
        e.preventDefault();
      }
    }

    handleTouchEnd(e) {
      if (!this.touchState.isMoving) {
        this.reset();
        return;
      }

      this.touchState.endTime = Date.now();
      const distance = this.getDistance();
      const duration = this.touchState.endTime - this.touchState.startTime;

      if (distance >= this.options.threshold && duration <= this.options.timeout) {
        const direction = this.getDirection();
        const velocity = this.getVelocity();

        this.triggerSwipe(direction, {
          distance,
          duration,
          velocity,
          startX: this.touchState.startX,
          startY: this.touchState.startY,
          endX: this.touchState.endX,
          endY: this.touchState.endY
        });
      }

      this.reset();
    }

    triggerSwipe(direction, details) {
      const event = new CustomEvent('swipe', {
        detail: { direction, ...details }
      });
      this.element.dispatchEvent(event);

      // Call specific callback
      const callback = this.callbacks[`onSwipe${direction.charAt(0).toUpperCase() + direction.slice(1)}`];
      if (callback) {
        callback.call(this, details);
      }
    }

    reset() {
      this.touchState.startX = 0;
      this.touchState.startY = 0;
      this.touchState.endX = 0;
      this.touchState.endY = 0;
      this.touchState.isMoving = false;
      this.element.classList.remove('gesture-active');
    }
  }

  // ============================================
  // LONG PRESS HANDLER
  // ============================================

  class LongPressHandler extends GestureDetector {
    constructor(element, options = {}) {
      super(element, options);
      this.callback = options.onLongPress || null;
      this.pressTimer = null;
      this.setupListeners();
    }

    setupListeners() {
      this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
      this.element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    }

    handleTouchStart(e) {
      const touch = e.touches[0];
      this.touchState.startX = touch.clientX;
      this.touchState.startY = touch.clientY;
      this.touchState.isLongPress = false;

      this.pressTimer = setTimeout(() => {
        this.touchState.isLongPress = true;
        this.triggerLongPress(e);
      }, this.options.longPressDelay);
    }

    handleTouchMove(e) {
      // Cancel long press if finger moves
      const touch = e.touches[0];
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - this.touchState.startX, 2) +
        Math.pow(touch.clientY - this.touchState.startY, 2)
      );

      if (moveDistance > 10) {
        this.cancel();
      }
    }

    handleTouchEnd(e) {
      this.cancel();
    }

    triggerLongPress(e) {
      const event = new CustomEvent('longpress', {
        detail: {
          x: this.touchState.startX,
          y: this.touchState.startY,
          originalEvent: e
        }
      });
      this.element.dispatchEvent(event);

      if (this.callback) {
        this.callback.call(this, { x: this.touchState.startX, y: this.touchState.startY });
      }

      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }

    cancel() {
      if (this.pressTimer) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
      }
      this.touchState.isLongPress = false;
    }
  }

  // ============================================
  // DOUBLE TAP HANDLER
  // ============================================

  class DoubleTapHandler extends GestureDetector {
    constructor(element, options = {}) {
      super(element, options);
      this.callback = options.onDoubleTap || null;
      this.options.doubleTapDelay = options.doubleTapDelay || 300;
      this.setupListeners();
    }

    setupListeners() {
      this.element.addEventListener('touchend', (e) => this.handleTap(e), { passive: true });
    }

    handleTap(e) {
      const now = Date.now();
      const timeSinceLastTap = now - this.touchState.lastTap;

      if (timeSinceLastTap < this.options.doubleTapDelay && timeSinceLastTap > 0) {
        this.triggerDoubleTap(e);
        this.touchState.lastTap = 0;
      } else {
        this.touchState.lastTap = now;
      }
    }

    triggerDoubleTap(e) {
      const touch = e.changedTouches[0];
      const event = new CustomEvent('doubletap', {
        detail: {
          x: touch.clientX,
          y: touch.clientY,
          originalEvent: e
        }
      });
      this.element.dispatchEvent(event);

      if (this.callback) {
        this.callback.call(this, { x: touch.clientX, y: touch.clientY });
      }
    }
  }

  // ============================================
  // PINCH TO ZOOM HANDLER
  // ============================================

  class PinchZoomHandler {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        minScale: 0.5,
        maxScale: 3,
        onPinch: options.onPinch || null,
        onPinchEnd: options.onPinchEnd || null,
        ...options
      };

      this.state = {
        initialDistance: 0,
        currentScale: 1,
        isActive: false
      };

      this.setupListeners();
    }

    setupListeners() {
      this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
      this.element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        this.state.isActive = true;
        this.state.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      }
    }

    handleTouchMove(e) {
      if (!this.state.isActive || e.touches.length !== 2) return;

      e.preventDefault();
      const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / this.state.initialDistance;

      this.state.currentScale = Math.max(
        this.options.minScale,
        Math.min(this.options.maxScale, scale)
      );

      this.triggerPinch(this.state.currentScale);
    }

    handleTouchEnd(e) {
      if (this.state.isActive) {
        this.state.isActive = false;
        this.triggerPinchEnd(this.state.currentScale);
        this.state.initialDistance = 0;
      }
    }

    getDistance(touch1, touch2) {
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    }

    triggerPinch(scale) {
      const event = new CustomEvent('pinch', {
        detail: { scale }
      });
      this.element.dispatchEvent(event);

      if (this.options.onPinch) {
        this.options.onPinch.call(this, scale);
      }
    }

    triggerPinchEnd(scale) {
      const event = new CustomEvent('pinchend', {
        detail: { scale }
      });
      this.element.dispatchEvent(event);

      if (this.options.onPinchEnd) {
        this.options.onPinchEnd.call(this, scale);
      }
    }
  }

  // ============================================
  // PULL TO REFRESH HANDLER
  // ============================================

  class PullToRefreshHandler {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        threshold: 80,
        onRefresh: options.onRefresh || null,
        ...options
      };

      this.state = {
        startY: 0,
        currentY: 0,
        isDragging: false,
        isRefreshing: false
      };

      this.indicator = this.createIndicator();
      this.setupListeners();
    }

    createIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'mobile-pull-refresh';
      indicator.innerHTML = '<div class="mobile-pull-refresh-icon">↻</div>';
      this.element.insertBefore(indicator, this.element.firstChild);
      return indicator;
    }

    setupListeners() {
      this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
      if (this.element.scrollTop === 0) {
        this.state.startY = e.touches[0].clientY;
        this.state.isDragging = true;
      }
    }

    handleTouchMove(e) {
      if (!this.state.isDragging || this.state.isRefreshing) return;

      this.state.currentY = e.touches[0].clientY;
      const pullDistance = this.state.currentY - this.state.startY;

      if (pullDistance > 0 && this.element.scrollTop === 0) {
        e.preventDefault();

        const progress = Math.min(pullDistance / this.options.threshold, 1);
        this.indicator.style.transform = `translateY(${pullDistance * 0.5}px)`;
        this.indicator.style.opacity = progress;

        if (pullDistance >= this.options.threshold) {
          this.indicator.classList.add('active');
        } else {
          this.indicator.classList.remove('active');
        }
      }
    }

    handleTouchEnd(e) {
      if (!this.state.isDragging) return;

      const pullDistance = this.state.currentY - this.state.startY;

      if (pullDistance >= this.options.threshold && !this.state.isRefreshing) {
        this.triggerRefresh();
      } else {
        this.reset();
      }

      this.state.isDragging = false;
    }

    triggerRefresh() {
      this.state.isRefreshing = true;
      this.indicator.classList.add('active');

      const event = new CustomEvent('pullrefresh');
      this.element.dispatchEvent(event);

      if (this.options.onRefresh) {
        Promise.resolve(this.options.onRefresh()).finally(() => {
          this.reset();
          this.state.isRefreshing = false;
        });
      } else {
        setTimeout(() => {
          this.reset();
          this.state.isRefreshing = false;
        }, 1000);
      }
    }

    reset() {
      this.indicator.style.transform = '';
      this.indicator.style.opacity = '';
      this.indicator.classList.remove('active');
      this.state.startY = 0;
      this.state.currentY = 0;
    }
  }

  // ============================================
  // SWIPEABLE CARDS
  // ============================================

  class SwipeableCard {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        threshold: 100,
        onSwipeLeft: options.onSwipeLeft || null,
        onSwipeRight: options.onSwipeRight || null,
        leftAction: options.leftAction || { label: 'Archive', color: '#4a7c59' },
        rightAction: options.rightAction || { label: 'Delete', color: '#c4314b' },
        ...options
      };

      this.state = {
        startX: 0,
        currentX: 0,
        isDragging: false
      };

      this.createActionButtons();
      this.setupListeners();
    }

    createActionButtons() {
      this.leftAction = document.createElement('div');
      this.leftAction.className = 'swipe-action-left';
      this.leftAction.textContent = this.options.leftAction.label;
      this.leftAction.style.background = this.options.leftAction.color;

      this.rightAction = document.createElement('div');
      this.rightAction.className = 'swipe-action-right';
      this.rightAction.textContent = this.options.rightAction.label;
      this.rightAction.style.background = this.options.rightAction.color;

      this.element.style.position = 'relative';
      this.element.appendChild(this.leftAction);
      this.element.appendChild(this.rightAction);
    }

    setupListeners() {
      this.element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
      this.state.startX = e.touches[0].clientX;
      this.state.isDragging = true;
      this.element.style.transition = 'none';
    }

    handleTouchMove(e) {
      if (!this.state.isDragging) return;

      e.preventDefault();
      this.state.currentX = e.touches[0].clientX;
      const deltaX = this.state.currentX - this.state.startX;

      this.element.style.transform = `translateX(${deltaX}px)`;

      // Show appropriate action
      if (deltaX > 0) {
        this.leftAction.style.opacity = Math.min(deltaX / this.options.threshold, 1);
      } else if (deltaX < 0) {
        this.rightAction.style.opacity = Math.min(Math.abs(deltaX) / this.options.threshold, 1);
      }
    }

    handleTouchEnd(e) {
      if (!this.state.isDragging) return;

      this.state.isDragging = false;
      this.element.style.transition = 'transform 0.3s ease';

      const deltaX = this.state.currentX - this.state.startX;

      if (Math.abs(deltaX) >= this.options.threshold) {
        if (deltaX > 0 && this.options.onSwipeRight) {
          this.options.onSwipeRight.call(this, this.element);
        } else if (deltaX < 0 && this.options.onSwipeLeft) {
          this.options.onSwipeLeft.call(this, this.element);
        }
      }

      // Reset position
      this.reset();
    }

    reset() {
      this.element.style.transform = '';
      this.leftAction.style.opacity = '0';
      this.rightAction.style.opacity = '0';
      this.state.startX = 0;
      this.state.currentX = 0;
    }
  }

  // ============================================
  // UTILITY: GESTURE MANAGER
  // ============================================

  class GestureManager {
    constructor() {
      this.handlers = new Map();
    }

    addSwipe(element, options) {
      const handler = new SwipeHandler(element, options);
      this.handlers.set(element, handler);
      return handler;
    }

    addLongPress(element, options) {
      const handler = new LongPressHandler(element, options);
      this.handlers.set(element, handler);
      return handler;
    }

    addDoubleTap(element, options) {
      const handler = new DoubleTapHandler(element, options);
      this.handlers.set(element, handler);
      return handler;
    }

    addPinchZoom(element, options) {
      const handler = new PinchZoomHandler(element, options);
      this.handlers.set(element, handler);
      return handler;
    }

    addPullToRefresh(element, options) {
      const handler = new PullToRefreshHandler(element, options);
      this.handlers.set(element, handler);
      return handler;
    }

    addSwipeableCard(element, options) {
      const handler = new SwipeableCard(element, options);
      this.handlers.set(element, handler);
      return handler;
    }

    remove(element) {
      const handler = this.handlers.get(element);
      if (handler && handler.destroy) {
        handler.destroy();
      }
      this.handlers.delete(element);
    }

    removeAll() {
      this.handlers.forEach((handler, element) => {
        if (handler.destroy) {
          handler.destroy();
        }
      });
      this.handlers.clear();
    }
  }

  // ============================================
  // EXPORT API
  // ============================================

  window.CoffeeGestures = {
    SwipeHandler,
    LongPressHandler,
    DoubleTapHandler,
    PinchZoomHandler,
    PullToRefreshHandler,
    SwipeableCard,
    GestureManager,

    // Create global gesture manager instance
    manager: new GestureManager()
  };

  console.log('Coffee Vault Gesture Handlers loaded');

})();

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Add swipe navigation to cards
const cards = document.querySelectorAll('.mobile-log-card');
cards.forEach(card => {
  CoffeeGestures.manager.addSwipe(card, {
    onSwipeLeft: () => {
      console.log('Swipe left - Archive');
    },
    onSwipeRight: () => {
      console.log('Swipe right - Share');
    }
  });
});

// Example 2: Long press for context menu
const items = document.querySelectorAll('.mobile-list-item');
items.forEach(item => {
  CoffeeGestures.manager.addLongPress(item, {
    onLongPress: (details) => {
      showContextMenu(details.x, details.y);
    }
  });
});

// Example 3: Double tap to favorite
const logCards = document.querySelectorAll('.mobile-log-card');
logCards.forEach(card => {
  CoffeeGestures.manager.addDoubleTap(card, {
    onDoubleTap: () => {
      card.classList.toggle('favorited');
    }
  });
});

// Example 4: Pinch to zoom on charts
const charts = document.querySelectorAll('.coffee-chart');
charts.forEach(chart => {
  CoffeeGestures.manager.addPinchZoom(chart, {
    onPinch: (scale) => {
      chart.style.transform = `scale(${scale})`;
    }
  });
});

// Example 5: Pull to refresh on main view
const mainContent = document.querySelector('.markdown-preview-view');
if (mainContent) {
  CoffeeGestures.manager.addPullToRefresh(mainContent, {
    onRefresh: async () => {
      // Refresh data
      await fetchLatestData();
    }
  });
}

// Example 6: Swipeable cards with actions
const swipeCards = document.querySelectorAll('[data-swipeable]');
swipeCards.forEach(card => {
  CoffeeGestures.manager.addSwipeableCard(card, {
    onSwipeLeft: (element) => {
      archiveLog(element.dataset.id);
    },
    onSwipeRight: (element) => {
      shareLog(element.dataset.id);
    },
    leftAction: { label: 'Share', color: '#4a7c59' },
    rightAction: { label: 'Archive', color: '#c4314b' }
  });
});
*/
