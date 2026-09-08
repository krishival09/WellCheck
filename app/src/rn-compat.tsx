import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Pressable, 
  ScrollView, 
  SafeAreaView, 
  TextInput as RNTextInput, 
  Image as RNImage, 
  StyleSheet, 
  Platform, 
  Vibration, 
  Dimensions, 
  StatusBar, 
  ActivityIndicator, 
  Switch, 
  Modal as RNModal,
  TextStyle,
  ViewStyle,
  ImageStyle
} from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Re-export standard React Native primitives
export {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  SafeAreaView,
  RNTextInput as TextInput,
  RNImage as Image,
  StyleSheet,
  Platform,
  Vibration,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Switch,
  RNModal as Modal,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global polyfills for Native runtime (Hermes / V8)
if (typeof global !== 'undefined') {
  const g = global as any;
  if (typeof g.localStorage === 'undefined') {
    const memStore: Record<string, string> = {};
    g.localStorage = {
      getItem: (key: string) => (key in memStore ? memStore[key] : null),
      setItem: (key: string, value: string) => { memStore[key] = String(value); },
      removeItem: (key: string) => { delete memStore[key]; },
      clear: () => { Object.keys(memStore).forEach(k => delete memStore[k]); },
      key: (i: number) => Object.keys(memStore)[i] || null,
      get length() { return Object.keys(memStore).length; }
    };
  }
  if (typeof g.window === 'undefined') {
    g.window = g;
  }
}

/**
 * Mobile Haptic feedback utility
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' | 'error' = 'light') {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'light': navigator.vibrate(15); break;
          case 'medium': navigator.vibrate(30); break;
          case 'heavy': navigator.vibrate([60, 40, 60]); break;
          case 'selection': navigator.vibrate(10); break;
          case 'error': navigator.vibrate([80, 50, 80, 50, 100]); break;
        }
      } catch {}
    }
  } else {
    try {
      switch (type) {
        case 'light': Vibration.vibrate(20); break;
        case 'medium': Vibration.vibrate(40); break;
        case 'heavy': Vibration.vibrate([0, 50, 50, 50]); break;
        case 'selection': Vibration.vibrate(10); break;
        case 'error': Vibration.vibrate([0, 100, 50, 100]); break;
      }
    } catch {}
  }
}

// -------------------------------------------------------------
// Lightweight Tailwind to React Native StyleSheet converter
// -------------------------------------------------------------
const colorPalette: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  'slate-900': '#0f172a',
  'slate-800': '#1e293b',
  'slate-700': '#334155',
  'slate-600': '#475569',
  'slate-500': '#64748b',
  'slate-400': '#94a3b8',
  'slate-300': '#cbd5e1',
  'slate-200': '#e2e8f0',
  'slate-100': '#f1f5f9',
  'slate-50': '#f8fafc',
  'amber-900': '#78350f',
  'amber-800': '#92400e',
  'amber-700': '#b45309',
  'amber-600': '#d97706',
  'amber-500': '#f59e0b',
  'amber-400': '#fbbf24',
  'amber-300': '#fcd34d',
  'amber-200': '#fde68a',
  'amber-100': '#fef3c7',
  'amber-50': '#fffbeb',
  'emerald-900': '#064e3b',
  'emerald-800': '#065f46',
  'emerald-700': '#047857',
  'emerald-600': '#059669',
  'emerald-500': '#10b981',
  'emerald-400': '#34d399',
  'emerald-200': '#a7f3d0',
  'emerald-100': '#d1fae5',
  'emerald-50': '#ecfdf5',
  'rose-900': '#4c0519',
  'rose-800': '#9f1239',
  'rose-700': '#be123c',
  'rose-600': '#e11d48',
  'rose-500': '#f43f5e',
  'rose-400': '#fb7185',
  'rose-200': '#fecdd3',
  'rose-100': '#ffe4e6',
  'rose-50': '#fff1f2',
  'red-700': '#b91c1c',
  'red-600': '#dc2626',
  'red-500': '#ef4444',
  'red-200': '#fecaca',
  'red-100': '#fee2e2',
  'red-50': '#fef2f2',
  'blue-700': '#1d4ed8',
  'blue-600': '#2563eb',
  'blue-500': '#3b82f6',
  'blue-100': '#dbeafe',
  'blue-50': '#eff6ff',
  'gray-800': '#1f2937',
  'gray-700': '#374151',
  'gray-600': '#4b5563',
  'gray-500': '#6b7280',
  'gray-400': '#9ca3af',
  'gray-300': '#d1d5db',
  'gray-200': '#e5e7eb',
  'gray-100': '#f3f4f6',
  'gray-50': '#f9fafb',
};

export function parseTailwind(className?: string): any {
  if (!className || Platform.OS === 'web') return {};

  const style: any = {};
  const tokens = className.split(/\s+/);

  for (const token of tokens) {
    if (!token) continue;

    // Hex background: bg-[#FAF7F2]
    if (token.startsWith('bg-[') && token.endsWith(']')) {
      style.backgroundColor = token.slice(4, -1);
      continue;
    }
    // Named background
    if (token.startsWith('bg-')) {
      const col = token.slice(3);
      if (colorPalette[col]) style.backgroundColor = colorPalette[col];
      continue;
    }

    // Text color
    if (token.startsWith('text-[') && token.endsWith(']')) {
      style.color = token.slice(6, -1);
      continue;
    }
    if (token.startsWith('text-')) {
      const col = token.slice(5);
      if (colorPalette[col]) {
        style.color = colorPalette[col];
        continue;
      }
      // Text sizes
      if (col === 'xs') { style.fontSize = 12; style.lineHeight = 16; continue; }
      if (col === 'sm') { style.fontSize = 14; style.lineHeight = 20; continue; }
      if (col === 'base') { style.fontSize = 16; style.lineHeight = 24; continue; }
      if (col === 'lg') { style.fontSize = 18; style.lineHeight = 28; continue; }
      if (col === 'xl') { style.fontSize = 20; style.lineHeight = 28; continue; }
      if (col === '2xl') { style.fontSize = 24; style.lineHeight = 32; continue; }
      if (col === '3xl') { style.fontSize = 30; style.lineHeight = 36; continue; }
      if (col === '4xl') { style.fontSize = 36; style.lineHeight = 40; continue; }
      if (col === '5xl') { style.fontSize = 48; style.lineHeight = 48; continue; }
      if (col === 'center') { style.textAlign = 'center'; continue; }
      if (col === 'left') { style.textAlign = 'left'; continue; }
      if (col === 'right') { style.textAlign = 'right'; continue; }
    }

    // Font weights
    if (token === 'font-normal') { style.fontWeight = '400'; continue; }
    if (token === 'font-medium') { style.fontWeight = '500'; continue; }
    if (token === 'font-semibold') { style.fontWeight = '600'; continue; }
    if (token === 'font-bold') { style.fontWeight = '700'; continue; }
    if (token === 'font-black') { style.fontWeight = '900'; continue; }

    // Flex layout
    if (token === 'flex') { style.display = 'flex'; continue; }
    if (token === 'flex-1') { style.flex = 1; continue; }
    if (token === 'flex-col') { style.flexDirection = 'column'; continue; }
    if (token === 'flex-row') { style.flexDirection = 'row'; continue; }
    if (token === 'flex-wrap') { style.flexWrap = 'wrap'; continue; }
    if (token === 'items-center') { style.alignItems = 'center'; continue; }
    if (token === 'items-start') { style.alignItems = 'flex-start'; continue; }
    if (token === 'items-end') { style.alignItems = 'flex-end'; continue; }
    if (token === 'items-stretch') { style.alignItems = 'stretch'; continue; }
    if (token === 'justify-center') { style.justifyContent = 'center'; continue; }
    if (token === 'justify-between') { style.justifyContent = 'space-between'; continue; }
    if (token === 'justify-start') { style.justifyContent = 'flex-start'; continue; }
    if (token === 'justify-end') { style.justifyContent = 'flex-end'; continue; }
    if (token === 'justify-around') { style.justifyContent = 'space-around'; continue; }

    // Sizing
    if (token === 'w-full') { style.width = '100%'; continue; }
    if (token === 'h-full') { style.height = '100%'; continue; }
    if (token === 'min-h-screen') { style.flex = 1; continue; }

    // Padding & Margin (4px multiplier)
    const pMatch = token.match(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(\d+)$/);
    if (pMatch) {
      const [, prop, val] = pMatch;
      const num = parseInt(val, 10) * 4;
      if (prop === 'p') style.padding = num;
      else if (prop === 'px') style.paddingHorizontal = num;
      else if (prop === 'py') style.paddingVertical = num;
      else if (prop === 'pt') style.paddingTop = num;
      else if (prop === 'pb') style.paddingBottom = num;
      else if (prop === 'pl') style.paddingLeft = num;
      else if (prop === 'pr') style.paddingRight = num;
      else if (prop === 'm') style.margin = num;
      else if (prop === 'mx') style.marginHorizontal = num;
      else if (prop === 'my') style.marginVertical = num;
      else if (prop === 'mt') style.marginTop = num;
      else if (prop === 'mb') style.marginBottom = num;
      else if (prop === 'ml') style.marginLeft = num;
      else if (prop === 'mr') style.marginRight = num;
      continue;
    }

    // Gap
    const gapMatch = token.match(/^gap-(\d+)$/);
    if (gapMatch) {
      style.gap = parseInt(gapMatch[1], 10) * 4;
      continue;
    }

    // Border Radius
    if (token === 'rounded-none') { style.borderRadius = 0; continue; }
    if (token === 'rounded-sm') { style.borderRadius = 2; continue; }
    if (token === 'rounded') { style.borderRadius = 4; continue; }
    if (token === 'rounded-md') { style.borderRadius = 6; continue; }
    if (token === 'rounded-lg') { style.borderRadius = 8; continue; }
    if (token === 'rounded-xl') { style.borderRadius = 12; continue; }
    if (token === 'rounded-2xl') { style.borderRadius = 16; continue; }
    if (token === 'rounded-3xl') { style.borderRadius = 24; continue; }
    if (token === 'rounded-full') { style.borderRadius = 9999; continue; }

    // Border Width & Color
    if (token === 'border') { style.borderWidth = 1; continue; }
    if (token === 'border-2') { style.borderWidth = 2; continue; }
    if (token === 'border-4') { style.borderWidth = 4; continue; }
    if (token.startsWith('border-')) {
      const col = token.slice(7);
      if (colorPalette[col]) style.borderColor = colorPalette[col];
      continue;
    }

    // Shadow
    if (token.startsWith('shadow')) {
      style.shadowColor = '#000';
      style.shadowOffset = { width: 0, height: 2 };
      style.shadowOpacity = 0.1;
      style.shadowRadius = 6;
      style.elevation = 3;
      continue;
    }
  }

  return style;
}

/**
 * Universal child wrapper to prevent React Native "Text strings must be rendered within a <Text> component" crash
 */
export function wrapChildren(children: React.ReactNode, textStyle?: any): React.ReactNode {
  if (children === null || children === undefined || typeof children === 'boolean') {
    return null;
  }
  if (typeof children === 'string' || typeof children === 'number') {
    return <Text style={textStyle}>{children}</Text>;
  }
  if (Array.isArray(children)) {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return <Text style={textStyle}>{child}</Text>;
      }
      return child;
    });
  }
  return children;
}

// -------------------------------------------------------------
// Component Primitives with Automatic Native / Web switching
// -------------------------------------------------------------

export const Div = React.forwardRef<any, any>(({ className, style, children, onClick, onPress, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <div ref={ref} className={className} style={style} onClick={onClick || onPress} {...props}>{children}</div>;
  }
  const computedStyle = [parseTailwind(className), style];
  if (onClick || onPress) {
    return (
      <TouchableOpacity ref={ref} activeOpacity={0.8} onPress={onClick || onPress} style={computedStyle} {...props}>
        {wrapChildren(children)}
      </TouchableOpacity>
    );
  }
  return (
    <View ref={ref} style={computedStyle} {...props}>
      {wrapChildren(children)}
    </View>
  );
});
Div.displayName = 'Div';

export const Button = React.forwardRef<any, any>(({ className, style, children, onClick, onPress, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <button ref={ref} className={className} style={style} onClick={onClick || onPress} {...props}>{children}</button>;
  }
  return (
    <TouchableOpacity ref={ref} activeOpacity={0.7} onPress={onClick || onPress} style={[parseTailwind(className), style]} {...props}>
      {wrapChildren(children, { color: '#ffffff', fontWeight: 'bold' })}
    </TouchableOpacity>
  );
});
Button.displayName = 'Button';

export const Span = React.forwardRef<any, any>(({ className, style, children, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <span ref={ref} className={className} style={style} {...props}>{children}</span>;
  }
  return <Text ref={ref} style={[parseTailwind(className), style]} {...props}>{children}</Text>;
});
Span.displayName = 'Span';

export const P = React.forwardRef<any, any>(({ className, style, children, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <p ref={ref} className={className} style={style} {...props}>{children}</p>;
  }
  return <Text ref={ref} style={[parseTailwind(className), style]} {...props}>{children}</Text>;
});
P.displayName = 'P';

const makeHeading = (defaultSize: number, tag: string) => {
  const Comp = React.forwardRef<any, any>(({ className, style, children, ...props }, ref) => {
    if (Platform.OS === 'web') {
      return React.createElement(tag, { ref, className, style, ...props }, children);
    }
    return <Text ref={ref} style={[{ fontSize: defaultSize, fontWeight: 'bold' }, parseTailwind(className), style]} {...props}>{children}</Text>;
  });
  Comp.displayName = tag.toUpperCase();
  return Comp;
};

export const H1 = makeHeading(30, 'h1');
export const H2 = makeHeading(24, 'h2');
export const H3 = makeHeading(20, 'h3');
export const H4 = makeHeading(18, 'h4');
export const H5 = makeHeading(16, 'h5');
export const H6 = makeHeading(14, 'h6');

export const Label = React.forwardRef<any, any>(({ className, style, children, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <label ref={ref} className={className} style={style} {...props}>{children}</label>;
  }
  return <Text ref={ref} style={[{ fontSize: 14, fontWeight: '500' }, parseTailwind(className), style]} {...props}>{children}</Text>;
});
Label.displayName = 'Label';

export const Input = React.forwardRef<any, any>(({ className, style, onChange, onChangeText, value, placeholder, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <input ref={ref} className={className} style={style} onChange={onChange} value={value} placeholder={placeholder} {...props} />;
  }
  return (
    <RNTextInput
      ref={ref}
      style={[{ padding: 12, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, fontSize: 16 }, parseTailwind(className), style]}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      value={value !== undefined ? String(value) : undefined}
      onChangeText={(text) => {
        onChangeText?.(text);
        onChange?.({ target: { value: text } } as any);
      }}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export const Img = React.forwardRef<any, any>(({ className, style, src, alt, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <img ref={ref} className={className} style={style} src={src} alt={alt} {...props} />;
  }
  const source = typeof src === 'string' ? { uri: src } : src;
  return <RNImage ref={ref} source={source} style={[parseTailwind(className), style]} resizeMode="contain" {...props} />;
});
Img.displayName = 'Img';

export const Main = Div;
export const Header = Div;
export const Footer = Div;
export const Section = Div;
export const Nav = Div;
export const Aside = Div;
export const Ul = Div;
export const Li = Div;
export const Form = Div;
