/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ":root {\r\n  --live-photo-badge-bg: rgba(64, 64, 64, 0.5);\r\n  --live-photo-badge-hover-bg: rgba(64, 64, 64, 0.7);\r\n  --live-photo-text-color: #fff;\r\n  --live-photo-border-radius: 12px;\r\n  --live-photo-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n  --live-photo-progress-height: 3px;\r\n  --live-photo-progress-color: #fff;\r\n  --live-photo-dropdown-bg: rgba(64, 64, 64, 0.25);\r\n  --live-photo-dropdown-button-hover: rgba(64, 64, 64, 0.5);\r\n}\r\n\r\n[data-theme=\"dark\"] {\r\n  --live-photo-badge-bg: rgba(32, 32, 32, 0.7);\r\n  --live-photo-badge-hover-bg: rgba(32, 32, 32, 0.9);\r\n  --live-photo-dropdown-bg: rgba(32, 32, 32, 0.5);\r\n  --live-photo-dropdown-button-hover: rgba(32, 32, 32, 0.7);\r\n}\r\n\r\n[data-theme=\"light\"] {\r\n  --live-photo-badge-bg: rgba(255, 255, 255, 0.7);\r\n  --live-photo-badge-hover-bg: rgba(255, 255, 255, 0.9);\r\n  --live-photo-text-color: #000;\r\n  --live-photo-dropdown-bg: rgba(255, 255, 255, 0.5);\r\n  --live-photo-dropdown-button-hover: rgba(255, 255, 255, 0.7);\r\n}\r\n\r\n.live-photo-container {\r\n  position: relative;\r\n  overflow: hidden;\r\n  will-change: transform;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  user-select: none;\r\n}\r\n\r\n.live-photo-image,\r\n.live-photo-video {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  object-fit: cover;\r\n  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),\r\n    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);\r\n  backface-visibility: hidden;\r\n  will-change: transform, opacity;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  user-select: none;\r\n  touch-action: none;\r\n  pointer-events: none;\r\n}\r\n\r\n.live-photo-video {\r\n  opacity: 0;\r\n  transform: scale(1.02); /* 初始稍微放大 */\r\n}\r\n\r\n.live-photo-image {\r\n  -webkit-touch-callout: none;\r\n  opacity: 1;\r\n  transform: scale(1);\r\n}\r\n\r\n.live-photo-badge {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  position: absolute;\r\n  left: 12px;\r\n  top: 16px;\r\n  z-index: 10;\r\n  background: var(--live-photo-badge-bg);\r\n  border-radius: var(--live-photo-border-radius);\r\n  color: var(--live-photo-text-color);\r\n  cursor: pointer;\r\n  height: 24px;\r\n  padding: 0 8px;\r\n  box-sizing: border-box;\r\n  transition: all var(--live-photo-transition);\r\n}\r\n\r\n.live-photo-badge .live-icon {\r\n  width: 16px;\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  margin: 2px;\r\n}\r\n\r\n.live-photo-badge .live-text {\r\n  font-size: 12px;\r\n  font-weight: 500;\r\n  /* line-height: 120%; */\r\n  margin-right: 1px;\r\n  margin-left: 4px;\r\n}\r\n\r\n/* 图标 */\r\n.live-photo-badge .chevron {\r\n  align-items: center;\r\n  display: flex;\r\n  height: 100%;\r\n  justify-content: center;\r\n  opacity: 0;\r\n  transition: all 0.15s;\r\n  width: 8px;\r\n}\r\n\r\n.live-photo-badge:hover .chevron {\r\n  opacity: 1;\r\n  width: 24px;\r\n}\r\n.live-photo-badge:hover::after {\r\n  content: \"\";\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 24px;\r\n  bottom: 0;\r\n  right: auto;\r\n  height: 40px;\r\n  width: 200%;\r\n  background-color: none;\r\n  z-index: 10;\r\n}\r\n\r\n.dropdown-menu {\r\n  position: absolute;\r\n  top: 50px;\r\n  left: 12px;\r\n  z-index: 15;\r\n  padding: 5px;\r\n  color: var(--live-photo-text-color);\r\n  background: var(--live-photo-dropdown-bg);\r\n  border-radius: var(--live-photo-border-radius);\r\n  backdrop-filter: saturate(150%) blur(10px);\r\n  cursor: pointer;\r\n  display: none;\r\n}\r\n\r\n.dropdown-menu.show {\r\n  display: block;\r\n}\r\n\r\n.dropdown-menu button {\r\n  color: var(--live-photo-text-color);\r\n  border: none;\r\n  border-radius: 4px;\r\n  padding: 5px 10px;\r\n  cursor: pointer;\r\n  transition: background var(--live-photo-transition);\r\n  background: none;\r\n}\r\n\r\n.dropdown-menu button:hover {\r\n  background: var(--live-photo-dropdown-button-hover);\r\n}\r\n\r\n.live-photo-container.playing .live-photo-video {\r\n  opacity: 1;\r\n  transform: scale(1.05); /* 播放时恢复正常大小 */\r\n}\r\n\r\n.live-photo-container.playing .live-photo-image {\r\n  opacity: 0;\r\n  transform: scale(0.98); /* 淡出时稍微缩小 */\r\n}\r\n\r\n.live-photo-badge svg {\r\n  vertical-align: middle;\r\n}\r\n\r\n.live-photo-badge .progress-circle {\r\n  transition: stroke-dashoffset 0.3s ease;\r\n}\r\n\r\n/* 确保图标在加载时保持清晰 */\r\n.live-photo-badge svg circle {\r\n  vector-effect: non-scaling-stroke;\r\n}\r\n\r\n/* Progress bar */\r\n.live-photo-progress {\r\n  position: absolute;\r\n  bottom: 0;\r\n  left: 0;\r\n  width: 0%;\r\n  height: var(--live-photo-progress-height);\r\n  background: var(--live-photo-progress-color);\r\n  transition: width 0.2s;\r\n  opacity: 0;\r\n}\r\n\r\n/* Overlay to prevent video from blocking scroll */\r\n.live-photo-overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  z-index: 5;\r\n  background: transparent;\r\n  pointer-events: auto;\r\n  touch-action: pan-y pan-x;\r\n}\r\n";
styleInject(css_248z);

class StateManager {
    constructor(initialState = {}) {
        this.state = Object.assign({ isPlaying: false, autoplay: true, videoError: false, videoLoaded: false, aspectRatio: 1, isLongPressPlaying: false }, initialState);
        this.listeners = new Set();
    }
    getState() {
        return Object.freeze(Object.assign({}, this.state));
    }
    setState(updates) {
        this.state = Object.assign(Object.assign({}, this.state), updates);
        this.notifyListeners();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners() {
        const currentState = this.getState();
        this.listeners.forEach(listener => listener(currentState));
    }
    destroy() {
        this.listeners.clear();
    }
}

class EventManager {
    constructor() {
        this.registrations = [];
    }
    addEventListener(element, event, handler, options) {
        const boundHandler = handler;
        element.addEventListener(event, boundHandler, options);
        this.registrations.push({
            element,
            event,
            handler,
            boundHandler,
        });
    }
    removeEventListener(element, event, handler) {
        const index = this.registrations.findIndex(reg => reg.element === element && reg.event === event && reg.handler === handler);
        if (index !== -1) {
            const registration = this.registrations[index];
            element.removeEventListener(event, registration.boundHandler);
            this.registrations.splice(index, 1);
        }
    }
    destroy() {
        this.registrations.forEach(({ element, event, boundHandler }) => {
            element.removeEventListener(event, boundHandler);
        });
        this.registrations = [];
    }
}

const arrowIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z"/></svg>
`;
const errorIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m3.5 3.5l9 9m2-4.5a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Z"/></svg>
 `;
const createProgressLiveIcon = (progress, showSlash = false) => {
    // 图标尺寸常量
    const ICON_SIZE = 12; // SVG 整体尺寸
    const CENTER_DOT_RADIUS = 1; // 中心圆点半径
    const INNER_CIRCLE_RADIUS = 3; // 内圈半径
    const INNER_CIRCLE_STROKE = 1; // 内圈线宽
    const OUTER_CIRCLE_RADIUS = 5; // 外圈圆点分布半径
    const OUTER_DOT_RADIUS = 0.3; // 外圈圆点大小
    const TOTAL_DOTS = 12; // 外圈圆点数量
    // 计算外圈圆点的数量和位置
    const center = ICON_SIZE / 2; // 中心点坐标
    const dots = Array.from({ length: TOTAL_DOTS }, (_, i) => {
        const angle = (i * 2 * Math.PI) / TOTAL_DOTS;
        const x = center + OUTER_CIRCLE_RADIUS * Math.sin(angle);
        const y = center - OUTER_CIRCLE_RADIUS * Math.cos(angle);
        const opacity = i / TOTAL_DOTS <= progress / 100 ? "1" : "0.2";
        return `<circle cx="${x}" cy="${y}" r="${OUTER_DOT_RADIUS}" fill="currentColor" opacity="${opacity}" />`;
    }).join("");
    // 添加斜杠的SVG路径
    const slash = showSlash ? `<path d="M1 11L11 1" stroke="currentColor" stroke-width="1.5"/>` : '';
    return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">
    <g fill="none" stroke="currentColor" stroke-width="${INNER_CIRCLE_STROKE}">
      <circle cx="${center}" cy="${center}" r="${CENTER_DOT_RADIUS}" fill="currentColor"/>
      <circle cx="${center}" cy="${center}" r="${INNER_CIRCLE_RADIUS}" />
      ${dots}
      ${slash}
    </g>
  </svg>
`;
};

class UIComponents {
    static createContainer(options) {
        const container = document.createElement('div');
        container.className = 'live-photo-container';
        if (options.width) {
            const width = typeof options.width === 'number' ? `${options.width}px` : options.width;
            container.style.width = width;
        }
        if (options.height) {
            const height = typeof options.height === 'number' ? `${options.height}px` : options.height;
            container.style.height = height;
        }
        if (!options.width && !options.height) {
            container.style.width = '300px';
            container.style.height = '300px';
        }
        // Apply theme
        if (options.theme) {
            container.setAttribute('data-theme', options.theme);
        }
        // Apply borderRadius to container
        if (options.borderRadius) {
            const borderRadius = typeof options.borderRadius === 'number'
                ? `${options.borderRadius}px`
                : options.borderRadius;
            container.style.borderRadius = borderRadius;
        }
        return container;
    }
    static createPhoto(src, customization) {
        const photo = new Image();
        photo.src = src;
        photo.className = 'live-photo-image';
        if (customization) {
            UIComponents.applyCustomization(photo, customization);
        }
        UIComponents.preventDefaultBehaviors(photo);
        return photo;
    }
    static createVideo(src, lazyLoad, customization) {
        const video = document.createElement('video');
        video.loop = false;
        video.muted = true;
        video.playsInline = true;
        video.className = 'live-photo-video';
        if (!lazyLoad) {
            video.src = src;
        }
        if (customization) {
            UIComponents.applyCustomization(video, customization);
        }
        UIComponents.preventDefaultBehaviors(video);
        return video;
    }
    static createBadge(autoplay, staticIcon = false) {
        const badge = document.createElement('div');
        badge.className = 'live-photo-badge';
        UIComponents.updateBadgeContent(badge, 100, autoplay, staticIcon);
        return badge;
    }
    static updateBadgeContent(badge, progress, autoplay, staticIcon = false) {
        const showSlash = staticIcon ? false : !autoplay;
        badge.innerHTML = `
      ${createProgressLiveIcon(progress, showSlash)}
      <span class="live-text">LIVE</span>
      <span class="chevron">${arrowIcon}</span>
    `;
    }
    static createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'live-photo-progress';
        return progressBar;
    }
    static createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'live-photo-overlay';
        return overlay;
    }
    static createDropMenu(autoplay) {
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        const button = document.createElement('button');
        button.id = 'toggle-autoplay';
        button.textContent = autoplay ? '关闭自动播放' : '开启自动播放';
        menu.appendChild(button);
        return menu;
    }
    static applyCustomization(element, customization) {
        if (customization.styles) {
            Object.assign(element.style, customization.styles);
        }
        if (customization.attributes) {
            Object.entries(customization.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
    }
    static preventDefaultBehaviors(element) {
        element.style.userSelect = 'none';
        element.style.touchAction = 'manipulation';
        const preventDefault = (e) => e.preventDefault();
        ['touchstart', 'mousedown', 'selectstart', 'touchmove', 'touchend'].forEach(event => {
            element.addEventListener(event, preventDefault);
        });
    }
}

function validateOptions(options) {
    if (!options.photoSrc) {
        throw new Error('photoSrc is required');
    }
    if (!options.videoSrc) {
        throw new Error('videoSrc is required');
    }
    if (!options.container || !(options.container instanceof HTMLElement)) {
        throw new Error('container must be a valid HTMLElement');
    }
    if (options.longPressDelay !== undefined && options.longPressDelay < 0) {
        throw new Error('longPressDelay must be a positive number');
    }
    if (options.retryAttempts !== undefined && options.retryAttempts < 1) {
        throw new Error('retryAttempts must be at least 1');
    }
}

function debounce(func, wait) {
    let timeout = null;
    return function (...args) {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}
function createLivePhotoError(type, message, originalError) {
    return {
        type,
        message,
        originalError,
    };
}

class LivePhotoViewer {
    constructor(options) {
        var _a, _b, _c, _d;
        this.touchStartTime = 0;
        this.aspectRatio = 1;
        // Validate options
        validateOptions(options);
        // Set default options
        this.options = Object.assign({ autoplay: true, lazyLoadVideo: false, longPressDelay: 300, retryAttempts: 3, enableVibration: true, staticBadgeIcon: false }, options);
        // Initialize managers
        this.stateManager = new StateManager({
            autoplay: this.options.autoplay,
        });
        this.eventManager = new EventManager();
        // Store video source
        this.videoSrc = this.options.videoSrc;
        // Create UI components
        this.container = UIComponents.createContainer(this.options);
        // Merge borderRadius into customization if provided
        const imageCustomization = this.mergeCustomization(this.options.imageCustomization, this.options.borderRadius);
        const videoCustomization = this.mergeCustomization(this.options.videoCustomization, this.options.borderRadius);
        this.photo = UIComponents.createPhoto(this.options.photoSrc, imageCustomization);
        this.video = UIComponents.createVideo(this.options.videoSrc, (_a = this.options.lazyLoadVideo) !== null && _a !== void 0 ? _a : false, videoCustomization);
        this.badge = UIComponents.createBadge((_b = this.options.autoplay) !== null && _b !== void 0 ? _b : true, (_c = this.options.staticBadgeIcon) !== null && _c !== void 0 ? _c : false);
        this.dropMenu = UIComponents.createDropMenu((_d = this.options.autoplay) !== null && _d !== void 0 ? _d : true);
        this.progressBar = UIComponents.createProgressBar();
        this.overlay = UIComponents.createOverlay();
        // Assemble DOM
        this.assembleDOM();
        // Setup event listeners
        this.setupEventListeners();
        // Initialize
        this.initialize();
    }
    assembleDOM() {
        this.container.appendChild(this.progressBar);
        this.container.appendChild(this.photo);
        this.container.appendChild(this.video);
        this.container.appendChild(this.overlay);
        this.container.appendChild(this.badge);
        this.container.appendChild(this.dropMenu);
        this.options.container.appendChild(this.container);
    }
    setupEventListeners() {
        // Photo events
        this.eventManager.addEventListener(this.photo, 'load', this.handlePhotoLoad.bind(this));
        this.eventManager.addEventListener(this.photo, 'error', this.handlePhotoError.bind(this));
        // Video events
        this.eventManager.addEventListener(this.video, 'ended', this.handleVideoEnd.bind(this));
        this.eventManager.addEventListener(this.video, 'error', this.handleVideoError.bind(this));
        this.eventManager.addEventListener(this.video, 'progress', debounce(this.handleVideoProgress.bind(this), 100));
        this.eventManager.addEventListener(this.video, 'loadeddata', this.handleVideoLoadedData.bind(this));
        this.eventManager.addEventListener(this.video, 'canplay', this.handleCanPlay.bind(this));
        this.eventManager.addEventListener(this.video, 'loadedmetadata', this.handleVideoLoad.bind(this));
        // Badge events
        this.eventManager.addEventListener(this.badge, 'click', this.toggleDropMenu.bind(this));
        // Dropdown menu button
        const toggleButton = this.dropMenu.querySelector('#toggle-autoplay');
        if (toggleButton) {
            this.eventManager.addEventListener(toggleButton, 'click', this.handleToggleAutoplay.bind(this));
        }
        // Interaction events
        if (isMobile()) {
            this.setupMobileEvents();
        }
        else {
            this.setupDesktopEvents();
        }
    }
    setupMobileEvents() {
        this.eventManager.addEventListener(this.overlay, 'touchstart', this.handleTouchStart.bind(this));
        this.eventManager.addEventListener(this.overlay, 'touchend', this.handleTouchEnd.bind(this));
    }
    setupDesktopEvents() {
        this.eventManager.addEventListener(this.badge, 'mouseenter', () => {
            const state = this.stateManager.getState();
            // 悬浮播放：只要没有错误就可以播放，不受 autoplay 状态限制
            if (!state.videoError) {
                this.play();
            }
        });
        this.eventManager.addEventListener(this.badge, 'mouseleave', () => {
            const state = this.stateManager.getState();
            // 鼠标离开时停止播放
            if (!state.videoError) {
                this.stop();
            }
        });
    }
    handlePhotoLoad(event) {
        var _a, _b;
        this.aspectRatio = this.photo.naturalWidth / this.photo.naturalHeight;
        this.updateContainerSize();
        (_b = (_a = this.options).onPhotoLoad) === null || _b === void 0 ? void 0 : _b.call(_a, event, this.photo);
    }
    handlePhotoError(event) {
        var _a, _b;
        const error = createLivePhotoError('PHOTO_LOAD_ERROR', 'Failed to load photo');
        (_b = (_a = this.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, event);
    }
    handleVideoEnd(event) {
        var _a, _b;
        if (!this.video.loop) {
            this.stop();
            this.stateManager.setState({
                isPlaying: false,
                isLongPressPlaying: false
            });
            this.container.classList.remove('playing');
            (_b = (_a = this.options).onEnded) === null || _b === void 0 ? void 0 : _b.call(_a, event, this.video);
        }
    }
    handleVideoError(event) {
        var _a, _b;
        this.video.style.display = 'none';
        this.stateManager.setState({ videoError: true });
        this.badge.innerHTML = errorIcon;
        this.container.classList.remove('playing');
        const error = createLivePhotoError('VIDEO_LOAD_ERROR', 'Failed to load video');
        (_b = (_a = this.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, event);
    }
    handleVideoProgress(event) {
        var _a, _b, _c;
        if (this.video.buffered.length > 0) {
            const progress = Math.floor((this.video.buffered.end(0) / this.video.duration) * 100);
            const state = this.stateManager.getState();
            UIComponents.updateBadgeContent(this.badge, progress, state.autoplay, (_a = this.options.staticBadgeIcon) !== null && _a !== void 0 ? _a : false);
            (_c = (_b = this.options).onProgress) === null || _c === void 0 ? void 0 : _c.call(_b, progress, event, this.video);
            // Restore badge after loading complete
            if (progress >= 100) {
                setTimeout(() => {
                    var _a;
                    UIComponents.updateBadgeContent(this.badge, 100, state.autoplay, (_a = this.options.staticBadgeIcon) !== null && _a !== void 0 ? _a : false);
                }, 500);
            }
        }
    }
    handleVideoLoadedData() {
        var _a;
        if (this.video.buffered.length > 0) {
            const progress = Math.floor((this.video.buffered.end(0) / this.video.duration) * 100);
            const state = this.stateManager.getState();
            UIComponents.updateBadgeContent(this.badge, progress, state.autoplay, (_a = this.options.staticBadgeIcon) !== null && _a !== void 0 ? _a : false);
        }
    }
    handleCanPlay(event) {
        var _a, _b;
        (_b = (_a = this.options).onCanPlay) === null || _b === void 0 ? void 0 : _b.call(_a, event, this.video);
    }
    handleVideoLoad(event) {
        var _a, _b;
        const duration = this.video.duration || 0;
        (_b = (_a = this.options).onVideoLoad) === null || _b === void 0 ? void 0 : _b.call(_a, duration, event, this.video);
    }
    toggleDropMenu() {
        this.dropMenu.classList.toggle('show');
    }
    handleToggleAutoplay(e) {
        var _a;
        e.stopPropagation();
        const state = this.stateManager.getState();
        const newAutoplay = !state.autoplay;
        this.stateManager.setState({ autoplay: newAutoplay });
        const button = this.dropMenu.querySelector('#toggle-autoplay');
        if (button) {
            button.textContent = newAutoplay ? '关闭自动播放' : '开启自动播放';
        }
        UIComponents.updateBadgeContent(this.badge, 100, newAutoplay, (_a = this.options.staticBadgeIcon) !== null && _a !== void 0 ? _a : false);
        this.toggleDropMenu();
        // 如果关闭自动播放且正在播放，则停止
        if (!newAutoplay && state.isPlaying) {
            this.stop();
        }
    }
    handleTouchStart() {
        this.touchStartTime = Date.now();
        const state = this.stateManager.getState();
        if (!state.videoError && !state.isPlaying) {
            this.stateManager.setState({ isLongPressPlaying: true });
            this.play();
        }
    }
    handleTouchEnd(event) {
        var _a, _b, _c;
        const touchDuration = Date.now() - this.touchStartTime;
        const longPressDelay = (_a = this.options.longPressDelay) !== null && _a !== void 0 ? _a : 300;
        // Short press (click)
        if (touchDuration < longPressDelay) {
            (_c = (_b = this.options).onClick) === null || _c === void 0 ? void 0 : _c.call(_b, event);
        }
        // Stop playback
        const state = this.stateManager.getState();
        if (state.isLongPressPlaying && !state.videoError && state.isPlaying) {
            this.stateManager.setState({ isLongPressPlaying: false });
            this.stop();
        }
    }
    initialize() {
        const state = this.stateManager.getState();
        // Setup lazy loading if enabled
        if (this.options.lazyLoadVideo) {
            this.setupLazyLoading();
        }
        // Autoplay if enabled
        if (state.autoplay) {
            this.play();
        }
    }
    setupLazyLoading() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                var _a, _b, _c;
                if (entry.isIntersecting && !this.video.src) {
                    (_b = (_a = this.options).onLoadStart) === null || _b === void 0 ? void 0 : _b.call(_a);
                    this.video.src = this.videoSrc;
                    this.stateManager.setState({ videoLoaded: true });
                    (_c = this.intersectionObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
                }
            });
        });
        this.intersectionObserver.observe(this.container);
    }
    updateContainerSize() {
        const computedStyle = window.getComputedStyle(this.container);
        const currentWidth = parseFloat(computedStyle.width);
        const currentHeight = parseFloat(computedStyle.height);
        if (this.container.style.width && !this.container.style.height) {
            this.container.style.height = `${currentWidth / this.aspectRatio}px`;
        }
        if (this.container.style.height && !this.container.style.width) {
            this.container.style.width = `${currentHeight * this.aspectRatio}px`;
        }
    }
    // Public API methods
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const state = this.stateManager.getState();
            if (state.isPlaying || state.videoError) {
                return;
            }
            try {
                // Load video if not loaded yet
                if (!state.videoLoaded && !this.video.src) {
                    this.progressBar.style.opacity = '1';
                    UIComponents.updateBadgeContent(this.badge, 0, state.autoplay, (_a = this.options.staticBadgeIcon) !== null && _a !== void 0 ? _a : false);
                    this.video.src = this.videoSrc;
                    this.stateManager.setState({ videoLoaded: true });
                }
                this.stateManager.setState({ isPlaying: true });
                this.video.currentTime = 0;
                UIComponents.updateBadgeContent(this.badge, 100, state.autoplay, (_b = this.options.staticBadgeIcon) !== null && _b !== void 0 ? _b : false);
                yield this.video.play();
                // Haptic feedback
                if (this.options.enableVibration && navigator.vibrate) {
                    navigator.vibrate(200);
                }
                requestAnimationFrame(() => {
                    this.container.classList.add('playing');
                    this.photo.style.opacity = '0';
                });
            }
            catch (error) {
                const livePhotoError = createLivePhotoError('PLAYBACK_ERROR', 'Failed to play video', error);
                (_d = (_c = this.options).onError) === null || _d === void 0 ? void 0 : _d.call(_c, livePhotoError);
                this.stop();
            }
        });
    }
    pause() {
        const state = this.stateManager.getState();
        if (state.isPlaying) {
            this.stateManager.setState({ isPlaying: false });
            this.video.pause();
            this.container.classList.remove('playing');
        }
    }
    stop() {
        const state = this.stateManager.getState();
        if (state.isPlaying) {
            this.stateManager.setState({ isPlaying: false });
            this.video.pause();
            this.container.classList.remove('playing');
            this.photo.style.opacity = '1';
        }
    }
    toggle() {
        const state = this.stateManager.getState();
        state.isPlaying ? this.pause() : this.play();
    }
    destroy() {
        // Clean up intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        // Clean up event listeners
        this.eventManager.destroy();
        // Clean up state manager
        this.stateManager.destroy();
        // Release media resources
        this.video.pause();
        this.video.src = '';
        this.video.load();
        this.photo.src = '';
        // Remove from DOM
        this.container.remove();
    }
    getState() {
        return this.stateManager.getState();
    }
    mergeCustomization(customization, borderRadius) {
        var _a;
        if (!borderRadius && !customization) {
            return customization;
        }
        const merged = Object.assign(Object.assign({}, customization), { styles: Object.assign({}, customization === null || customization === void 0 ? void 0 : customization.styles) });
        // Only apply borderRadius if not already set in customization
        if (borderRadius && !((_a = customization === null || customization === void 0 ? void 0 : customization.styles) === null || _a === void 0 ? void 0 : _a.borderRadius)) {
            const borderRadiusValue = typeof borderRadius === 'number'
                ? `${borderRadius}px`
                : borderRadius;
            merged.styles.borderRadius = borderRadiusValue;
        }
        return merged;
    }
}
// Export to window object for browser use
if (typeof window !== 'undefined') {
    window.LivePhotoViewer = LivePhotoViewer;
}

/**
 * 实况照片提取 - 平衡版本（性能与可靠性）
 */
/**
 * 快速字节查找（从后往前，针对实况照片优化）
 */
function findBytesFromEnd(arr, b0, b1, b2, b3) {
    // 从后往前搜索，实况照片的视频通常在后半部分
    for (let i = arr.length - 4; i >= 0; i--) {
        if (arr[i] === b0 && arr[i + 1] === b1 && arr[i + 2] === b2 && arr[i + 3] === b3) {
            return i;
        }
    }
    return -1;
}
/**
 * 快速验证 MP4 结构（检查前 8KB）
 */
function hasValidMp4(arr) {
    const checkLen = Math.min(arr.length, 8192);
    // 查找 moov 或 mdat（0x6D6F6F76 或 0x6D646174）
    for (let i = 0; i < checkLen - 3; i++) {
        const byte = arr[i];
        if (byte === 0x6D) { // 'm'
            const next = arr[i + 1];
            if (next === 0x6F) { // 'o'
                if (arr[i + 2] === 0x6F && arr[i + 3] === 0x76)
                    return true; // 'moov'
            }
            else if (next === 0x64) { // 'd'
                if (arr[i + 2] === 0x61 && arr[i + 3] === 0x74)
                    return true; // 'mdat'
            }
        }
    }
    return false;
}
/**
 * 从实况照片文件中提取视频和图片
 */
function extractFromLivePhoto(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const buffer = new Uint8Array(yield file.arrayBuffer());
            // 查找 'ftyp' (0x66747970)
            const ftypPos = findBytesFromEnd(buffer, 0x66, 0x74, 0x79, 0x70);
            if (ftypPos === -1)
                return null;
            // MP4 box 前 4 字节是 size，所以实际起始位置是 ftypPos - 4
            const mp4Start = Math.max(0, ftypPos - 4);
            // 验证 MP4 结构
            if (!hasValidMp4(buffer.subarray(mp4Start))) {
                return null;
            }
            // 创建 Blob 和 URL
            const photoBlob = new Blob([buffer.subarray(0, mp4Start)], { type: 'image/jpeg' });
            const videoBlob = new Blob([buffer.subarray(mp4Start)], { type: 'video/mp4' });
            return {
                photoBlob,
                photoUrl: URL.createObjectURL(photoBlob),
                videoBlob,
                videoUrl: URL.createObjectURL(videoBlob)
            };
        }
        catch (_a) {
            return null;
        }
    });
}

export { LivePhotoViewer, extractFromLivePhoto };
//# sourceMappingURL=LivePhotoViewer.esm.js.map
