import React, {
  Fragment,
  createElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const MOTION_PROPS = new Set([
  'initial',
  'animate',
  'exit',
  'variants',
  'transition',
  'whileInView',
  'viewport',
  'whileHover',
  'whileTap',
  'onHoverStart',
  'onHoverEnd',
  'layout',
  'custom',
]);

const VariantContext = createContext(null);
const PresenceContext = createContext({ exiting: false });
const motionComponentCache = new Map();
const motionProfileSubscribers = new Set();
let cachedMotionProfile = getMotionProfile();
let motionProfileCleanup = null;

function getMotionProfile() {
  if (typeof window === 'undefined') {
    return { reduced: false, mobile: false, coarse: false };
  }

  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    mobile: window.matchMedia('(max-width: 767px)').matches,
    coarse: window.matchMedia('(pointer: coarse)').matches,
  };
}

function useMotionProfile() {
  const [profile, setProfile] = useState(cachedMotionProfile);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const notify = () => {
      cachedMotionProfile = getMotionProfile();
      motionProfileSubscribers.forEach((listener) => listener(cachedMotionProfile));
    };

    if (!motionProfileCleanup) {
      const queries = [
        window.matchMedia('(prefers-reduced-motion: reduce)'),
        window.matchMedia('(max-width: 767px)'),
        window.matchMedia('(pointer: coarse)'),
      ];

      queries.forEach((query) => query.addEventListener?.('change', notify));
      window.addEventListener('resize', notify);
      motionProfileCleanup = () => {
        queries.forEach((query) => query.removeEventListener?.('change', notify));
        window.removeEventListener('resize', notify);
        motionProfileCleanup = null;
      };
      notify();
    }

    motionProfileSubscribers.add(setProfile);
    setProfile(cachedMotionProfile);

    return () => {
      motionProfileSubscribers.delete(setProfile);
      if (!motionProfileSubscribers.size) motionProfileCleanup?.();
    };
  }, []);

  return profile;
}

function isMotionValue(value) {
  return value && typeof value.get === 'function' && typeof value.on === 'function';
}

function createMotionValue(initialValue) {
  let value = initialValue;
  const listeners = new Set();

  return {
    get: () => value,
    set: (nextValue) => {
      value = nextValue;
      listeners.forEach(listener => listener(value));
    },
    on: (eventName, listener) => {
      if (eventName !== 'change') return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function resolveVariant(value, variants) {
  if (typeof value === 'string') return variants?.[value] || {};
  if (Array.isArray(value)) return value.reduce((acc, item) => ({ ...acc, ...resolveVariant(item, variants) }), {});
  return value || {};
}

function splitAnimationConfig(config = {}, fallbackTransition = {}) {
  const { transition, ...target } = config;
  return { target, transition: transition || fallbackTransition || {} };
}

function toGsapEase(ease) {
  if (Array.isArray(ease)) return 'power2.out';
  if (ease === 'easeOut') return 'power2.out';
  if (ease === 'easeIn') return 'power2.in';
  if (ease === 'easeInOut') return 'power2.inOut';
  if (ease === 'linear') return 'none';
  return ease || 'power2.out';
}

function toGsapVars(target, transition = {}) {
  const vars = { ...target };
  if (transition.duration !== undefined) vars.duration = transition.duration;
  else vars.duration = 0.45;
  if (transition.delay !== undefined) vars.delay = transition.delay;
  if (transition.ease !== undefined) vars.ease = toGsapEase(transition.ease);
  else vars.ease = 'power2.out';
  if (transition.repeat !== undefined) vars.repeat = transition.repeat === Infinity ? -1 : transition.repeat;
  if (transition.yoyo !== undefined) vars.yoyo = transition.yoyo;

  const keyframes = [];
  Object.keys(vars).forEach((key) => {
    if (Array.isArray(vars[key])) {
      const values = vars[key];
      delete vars[key];
      values.forEach((value, index) => {
        keyframes[index] = { ...(keyframes[index] || {}), [key]: value };
      });
    }
  });
  if (keyframes.length) vars.keyframes = keyframes;

  return vars;
}

function toMs(value, fallback) {
  return Math.max(0, Math.round((value ?? fallback) * 1000));
}

function toCssEase(ease) {
  if (Array.isArray(ease)) return 'cubic-bezier(.22,1,.36,1)';
  if (ease === 'easeOut' || ease === 'power2.out' || ease === 'power3.out') return 'cubic-bezier(.22,1,.36,1)';
  if (ease === 'easeIn' || ease === 'power2.in') return 'cubic-bezier(.32,0,.67,0)';
  if (ease === 'easeInOut' || ease === 'power2.inOut') return 'cubic-bezier(.65,0,.35,1)';
  if (ease === 'linear' || ease === 'none') return 'linear';
  return 'cubic-bezier(.22,1,.36,1)';
}

function finalValue(value) {
  return Array.isArray(value) ? value[value.length - 1] : value;
}

function unit(value, suffix = 'px') {
  if (value === undefined || value === null) return '';
  return typeof value === 'number' ? `${value}${suffix}` : String(value);
}

function targetToStyle(target = {}) {
  const style = {};
  const transforms = [];

  const x = finalValue(target.x);
  const y = finalValue(target.y);
  const xPercent = finalValue(target.xPercent);
  const yPercent = finalValue(target.yPercent);
  const scale = finalValue(target.scale);
  const rotate = finalValue(target.rotate);
  const rotateX = finalValue(target.rotateX);
  const rotateY = finalValue(target.rotateY);

  if (xPercent !== undefined) transforms.push(`translateX(${unit(xPercent, '%')})`);
  if (yPercent !== undefined) transforms.push(`translateY(${unit(yPercent, '%')})`);
  if (x !== undefined) transforms.push(`translateX(${unit(x)})`);
  if (y !== undefined) transforms.push(`translateY(${unit(y)})`);
  if (scale !== undefined) transforms.push(`scale(${scale})`);
  if (rotate !== undefined) transforms.push(`rotate(${unit(rotate, 'deg')})`);
  if (rotateX !== undefined) transforms.push(`rotateX(${unit(rotateX, 'deg')})`);
  if (rotateY !== undefined) transforms.push(`rotateY(${unit(rotateY, 'deg')})`);
  if (transforms.length) style.transform = transforms.join(' ');

  Object.entries(target).forEach(([key, rawValue]) => {
    if (['x', 'y', 'xPercent', 'yPercent', 'scale', 'rotate', 'rotateX', 'rotateY', 'transition'].includes(key)) return;
    const value = finalValue(rawValue);
    if (key === 'autoAlpha') {
      style.opacity = value;
      style.visibility = value <= 0 ? 'hidden' : 'visible';
    } else if (key === 'opacity') {
      style.opacity = value;
    } else if (key === 'boxShadow') {
      style.boxShadow = value;
    } else {
      style[key] = typeof value === 'number' && key !== 'zIndex' ? String(value) : value;
    }
  });

  return style;
}

function applyTarget(node, target) {
  if (!node) return;
  Object.assign(node.style, targetToStyle(target));
}

function animateTarget(node, target, transition = {}) {
  if (!node) return { kill: () => {} };
  const finalStyle = targetToStyle(target);
  const animation = node.animate(
    [finalStyle],
    {
      duration: toMs(transition.duration, 0.36),
      delay: toMs(transition.delay, 0),
      easing: toCssEase(transition.ease),
      iterations: transition.repeat === -1 ? Infinity : (transition.repeat ?? 1),
      direction: transition.yoyo ? 'alternate' : 'normal',
      fill: 'forwards',
    }
  );
  animation.onfinish = () => applyTarget(node, target);
  return { kill: () => animation.cancel() };
}

function clampDistance(value, max = 18) {
  if (typeof value !== 'number') return value;
  if (Math.abs(value) <= max) return value;
  return value < 0 ? -max : max;
}

function optimizeTargetForMotion(target, profile) {
  if (!target || (!profile.reduced && !profile.mobile)) return target;
  const next = { ...target };

  if (profile.reduced) {
    delete next.filter;
    delete next.rotate;
    delete next.rotateX;
    delete next.rotateY;
    return next;
  }

  next.x = clampDistance(next.x);
  next.y = clampDistance(next.y);
  next.xPercent = clampDistance(next.xPercent, 16);
  next.yPercent = clampDistance(next.yPercent, 16);
  if (typeof next.scale === 'number' && next.scale < 0.98) next.scale = 0.98;
  delete next.filter;
  return next;
}

function optimizeTransitionForMotion(transition = {}, profile) {
  if (!profile.reduced && !profile.mobile) return transition;
  if (profile.reduced) return { ...transition, duration: 0, delay: 0 };

  return {
    ...transition,
    duration: Math.min(transition.duration ?? 0.32, 0.32),
    delay: Math.min(transition.delay ?? 0, 0.08),
  };
}

function resolveStyle(style) {
  if (!style) return style;
  const next = { ...style };
  Object.keys(next).forEach((key) => {
    if (isMotionValue(next[key])) next[key] = next[key].get();
  });
  return next;
}

function subscribeStyleMotionValues(element, style) {
  if (!element || !style) return () => {};
  const unsubs = [];

  Object.entries(style).forEach(([key, value]) => {
    if (!isMotionValue(value)) return;
    unsubs.push(value.on('change', nextValue => {
      applyTarget(element, { [key]: nextValue });
    }));
  });

  return () => unsubs.forEach(unsub => unsub());
}

function MotionComponent(tag) {
  return forwardRef(function Component(props, ref) {
    const localRef = useRef(null);
    const tweenRef = useRef(null);
    const motionProfile = useMotionProfile();
    const parentVariant = useContext(VariantContext);
    const presence = useContext(PresenceContext);
    const [inView, setInView] = useState(false);
    const [activeVariant, setActiveVariant] = useState(null);
    const childIndex = useMemo(
      () => (parentVariant?.registerChild ? parentVariant.registerChild() : 0),
      []
    );
    const registeredChildren = useRef(0);
    const mergedRef = (node) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const {
      initial,
      animate: animateProp,
      variants,
      transition,
      whileInView,
      viewport,
      whileHover,
      whileTap,
      style,
      onMouseEnter,
      onMouseLeave,
      onHoverStart,
      onHoverEnd,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      ...rest
    } = props;

    const domProps = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (!MOTION_PROPS.has(key)) domProps[key] = value;
    });

    const inheritedInitial = initial ?? (variants ? parentVariant?.initial : undefined);
    const inheritedAnimate = animateProp ?? (variants ? parentVariant?.animate : undefined);
    const inheritedStagger = variants ? parentVariant?.staggerChildren || 0 : 0;

    const animateNode = (node, target, localTransition = {}) => {
      tweenRef.current?.kill?.();
      const optimizedTarget = optimizeTargetForMotion(target, motionProfile);
      const optimizedTransition = optimizeTransitionForMotion(localTransition, motionProfile);
      const delayedTransition = {
        ...optimizedTransition,
        delay: motionProfile.mobile || motionProfile.reduced
          ? (optimizedTransition.delay || 0)
          : (optimizedTransition.delay || 0) + (inheritedStagger * childIndex),
      };
      if (motionProfile.reduced) {
        applyTarget(node, optimizedTarget);
        return null;
      }
      tweenRef.current = animateTarget(node, optimizedTarget, delayedTransition);
      return tweenRef.current;
    };

    useEffect(() => {
      const node = localRef.current;
      if (!node) return undefined;
      const resolvedInitial = resolveVariant(inheritedInitial, variants);
      if (!motionProfile.reduced && inheritedInitial !== false && Object.keys(resolvedInitial).length) {
        const { target } = splitAnimationConfig(resolvedInitial);
        applyTarget(node, optimizeTargetForMotion(target, motionProfile));
      }
      return subscribeStyleMotionValues(node, style);
    }, [motionProfile.reduced, motionProfile.mobile]);

    useEffect(() => {
      const node = localRef.current;
      if (!node) return;
      const resolvedAnimate = resolveVariant(inheritedAnimate, variants);
      if (!Object.keys(resolvedAnimate).length) return;
      const { target, transition: localTransition } = splitAnimationConfig(resolvedAnimate, transition);
      animateNode(node, target, localTransition);
      setActiveVariant(inheritedAnimate);
    }, [inheritedAnimate, variants, transition]);

    useEffect(() => {
      const node = localRef.current;
      if (!node || !whileInView) return undefined;
      if (motionProfile.reduced) {
        setInView(true);
        return undefined;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setInView(true);
          if (viewport?.once) observer.disconnect();
        },
        { threshold: viewport?.amount || 0.15 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, [motionProfile.reduced, whileInView, viewport]);

    useEffect(() => {
      const node = localRef.current;
      if (!node || !inView || !whileInView) return;
      const { target, transition: localTransition } = splitAnimationConfig(resolveVariant(whileInView, variants), transition);
      animateNode(node, target, localTransition);
      setActiveVariant(whileInView);
    }, [inView, whileInView, variants, transition]);

    useEffect(() => {
      const node = localRef.current;
      if (!node || !presence.exiting || !props.exit) return;
      if (motionProfile.reduced) return;
      const { target, transition: localTransition } = splitAnimationConfig(resolveVariant(props.exit, variants), transition);
      animateNode(node, target, localTransition);
    }, [presence.exiting, props.exit, variants, transition]);

    const handleMouseEnter = (event) => {
      onMouseEnter?.(event);
      onHoverStart?.(event);
      if (whileHover && localRef.current && !motionProfile.coarse && !motionProfile.reduced) {
        animateTarget(
          localRef.current,
          optimizeTargetForMotion(resolveVariant(whileHover, variants), motionProfile),
          optimizeTransitionForMotion(transition, motionProfile)
        );
      }
    };

    const handleMouseLeave = (event) => {
      onMouseLeave?.(event);
      onHoverEnd?.(event);
      if ((whileHover || whileTap) && localRef.current && !motionProfile.reduced) {
        animateTarget(localRef.current, { scale: 1, y: 0, x: 0 }, { duration: 0.18, ease: 'power2.out' });
      }
    };

    const handlePointerDown = (event) => {
      onPointerDown?.(event);
      if (whileTap && localRef.current && !motionProfile.reduced) {
        animateTarget(localRef.current, optimizeTargetForMotion(resolveVariant(whileTap, variants), motionProfile), { duration: 0.1 });
      }
    };

    const handlePointerUp = (event) => {
      onPointerUp?.(event);
      if (whileTap && localRef.current) {
        animateTarget(localRef.current, { scale: 1 }, { duration: 0.12, ease: 'power2.out' });
      }
    };

    const handlePointerCancel = (event) => {
      onPointerCancel?.(event);
      if (whileTap && localRef.current) {
        animateTarget(localRef.current, { scale: 1 }, { duration: 0.12, ease: 'power2.out' });
      }
    };

    const element = createElement(tag, {
      ...domProps,
      ref: mergedRef,
      style: resolveStyle(style),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    });

    if (variants || initial || animateProp || whileInView) {
      const activeConfig = resolveVariant(activeVariant || inheritedAnimate, variants);
      const activeTransition = activeConfig.transition || {};

      return (
        <VariantContext.Provider value={{
          initial: inheritedInitial,
          animate: activeVariant || inheritedAnimate || inheritedInitial,
          staggerChildren: activeTransition.staggerChildren || 0,
          registerChild: () => registeredChildren.current++,
        }}>
          {element}
        </VariantContext.Provider>
      );
    }

    return element;
  });
}

export const motion = new Proxy({}, {
  get: (_, tag) => {
    if (typeof tag === 'symbol') return undefined;
    if (!motionComponentCache.has(tag)) {
      motionComponentCache.set(tag, MotionComponent(tag));
    }
    return motionComponentCache.get(tag);
  },
});

export function AnimatePresence({ children }) {
  const [presentChildren, setPresentChildren] = useState(children);
  const [exiting, setExiting] = useState(false);
  const presentKeyRef = useRef(
    React.isValidElement(children) ? (children.key || children.type) : children ? 'present' : 'empty'
  );

  useEffect(() => {
    const nextKey = React.isValidElement(children)
      ? (children.key || children.type)
      : children ? 'present' : 'empty';

    if (children) {
      if (presentKeyRef.current !== nextKey || exiting) {
        presentKeyRef.current = nextKey;
        setPresentChildren(children);
      }
      setExiting(false);
      return undefined;
    }

    if (!presentChildren) return undefined;

    setExiting(true);
    const timer = setTimeout(() => {
      setPresentChildren(null);
      setExiting(false);
      presentKeyRef.current = 'empty';
    }, 720);

    return () => clearTimeout(timer);
  }, [children, exiting, presentChildren]);

  if (!presentChildren) return null;

  return (
    <PresenceContext.Provider value={{ exiting }}>
      <Fragment>{presentChildren}</Fragment>
    </PresenceContext.Provider>
  );
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

export function useMotionValue(initialValue) {
  return useMemo(() => createMotionValue(initialValue), []);
}

function interpolate(inputValue, inputRange, outputRange) {
  const startInput = inputRange[0];
  const endInput = inputRange[inputRange.length - 1];
  const startOutput = outputRange[0];
  const endOutput = outputRange[outputRange.length - 1];
  const progress = endInput === startInput ? 0 : (inputValue - startInput) / (endInput - startInput);

  if (typeof startOutput === 'number' && typeof endOutput === 'number') {
    return startOutput + (endOutput - startOutput) * progress;
  }

  return progress >= 1 ? endOutput : startOutput;
}

export function useTransform(input, transformerOrRange, outputRange) {
  const transformer = Array.isArray(transformerOrRange)
    ? value => interpolate(value, transformerOrRange, outputRange || [])
    : transformerOrRange;
  const value = useMotionValue(transformer(input.get()));

  useEffect(() => {
    return input.on('change', nextValue => value.set(transformer(nextValue)));
  }, [input, transformer, value]);

  return value;
}

export function animate(value, target, options = {}) {
  if (!isMotionValue(value)) {
    return { stop: () => {} };
  }

  const start = Number(value.get()) || 0;
  const end = Number(target) || 0;
  const duration = toMs(options.duration, 0.4);
  const startedAt = performance.now();
  let frame = 0;
  let stopped = false;

  const tick = (now) => {
    if (stopped) return;
    const progress = duration ? Math.min((now - startedAt) / duration, 1) : 1;
    value.set(start + ((end - start) * progress));
    if (progress < 1) frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return {
    stop: () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
    },
  };
}

export function useScroll() {
  const progress = useMotionValue(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.set(max > 0 ? window.scrollY / max : 0);
      });
    };
    const updateNow = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? window.scrollY / max : 0);
    };

    updateNow();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [progress]);

  return { scrollYProgress: progress };
}

export function useSpring(value) {
  return value;
}
