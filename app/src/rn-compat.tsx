import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Pressable, 
  ScrollView, 
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
  Linking,
  TextStyle,
  ViewStyle,
  ImageStyle
} from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

declare module 'lucide-react-native' {
  interface LucideProps {
    className?: string;
  }
}



// Re-export standard React Native primitives
export {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
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
  Linking,
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
  if (typeof g.window.open === 'undefined') {
    g.window.open = (url: string) => {
      try {
        if (url) Linking.openURL(url);
      } catch (e) {
        console.warn('Linking.openURL error:', e);
      }
    };
  }
  if (!g.window.location) {
    g.window.location = {
      set href(val: string) {
        try {
          if (val) Linking.openURL(val);
        } catch (e) {
          console.warn('Linking.openURL error:', e);
        }
      },
      get href() {
        return '';
      }
    };
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
  'slate-750': '#293548',
  'slate-700': '#334155',
  'slate-600': '#475569',
  'slate-500': '#64748b',
  'slate-400': '#94a3b8',
  'slate-300': '#cbd5e1',
  'slate-200': '#e2e8f0',
  'slate-100': '#f1f5f9',
  'slate-50': '#f8fafc',
  'amber-950': '#451a03',
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
  'emerald-950': '#022c22',
  'emerald-900': '#064e3b',
  'emerald-800': '#065f46',
  'emerald-700': '#047857',
  'emerald-600': '#059669',
  'emerald-500': '#10b981',
  'emerald-400': '#34d399',
  'emerald-300': '#6ee7b7',
  'emerald-200': '#a7f3d0',
  'emerald-100': '#d1fae5',
  'emerald-50': '#ecfdf5',
  'rose-900': '#4c0519',
  'rose-800': '#9f1239',
  'rose-700': '#be123c',
  'rose-600': '#e11d48',
  'rose-500': '#f43f5e',
  'rose-400': '#fb7185',
  'rose-300': '#fda4af',
  'rose-200': '#fecdd3',
  'rose-100': '#ffe4e6',
  'rose-50': '#fff1f2',
  'red-900': '#7f1d1d',
  'red-700': '#b91c1c',
  'red-600': '#dc2626',
  'red-500': '#ef4444',
  'red-300': '#fca5a5',
  'red-200': '#fecaca',
  'red-100': '#fee2e2',
  'red-50': '#fef2f2',
  'blue-900': '#1e3a8a',
  'blue-700': '#1d4ed8',
  'blue-600': '#2563eb',
  'blue-500': '#3b82f6',
  'blue-300': '#93c5fd',
  'blue-100': '#dbeafe',
  'blue-50': '#eff6ff',
  'indigo-700': '#4338ca',
  'indigo-600': '#4f46e5',
  'indigo-200': '#c7d2fe',
  'indigo-100': '#e0e7ff',
  'purple-600': '#9333ea',
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

function parseColorWithOpacity(colorStr: string, opacityPercent?: string): string {
  let hex = colorPalette[colorStr] || colorStr;
  if (!opacityPercent) return hex;
  const alpha = parseInt(opacityPercent, 10) / 100;
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

export function parseTailwind(className?: string): any {
  if (!className || Platform.OS === 'web') return {};

  const style: any = {};
  const tokens = className.split(/\s+/);

  for (const token of tokens) {
    if (!token) continue;

    // Hex background: bg-[#FAF7F2] or bg-[#1A2B4C]/80
    const bgHexMatch = token.match(/^bg-\[#([0-9a-fA-F]+)\](?:\/(\d+))?$/);
    if (bgHexMatch) {
      style.backgroundColor = parseColorWithOpacity('#' + bgHexMatch[1], bgHexMatch[2]);
      continue;
    }
    // Named background with optional opacity: bg-slate-900, bg-white/20, bg-black/40
    const bgNamedMatch = token.match(/^bg-([a-zA-Z0-9-]+)(?:\/(\d+))?$/);
    if (bgNamedMatch && colorPalette[bgNamedMatch[1]]) {
      style.backgroundColor = parseColorWithOpacity(bgNamedMatch[1], bgNamedMatch[2]);
      continue;
    }

    // Hex text: text-[#1A2B4C] or text-[#1A2B4C]/70
    const textHexMatch = token.match(/^text-\[#([0-9a-fA-F]+)\](?:\/(\d+))?$/);
    if (textHexMatch) {
      style.color = parseColorWithOpacity('#' + textHexMatch[1], textHexMatch[2]);
      continue;
    }
    // Named text with optional opacity: text-white/80, text-slate-400
    const textNamedMatch = token.match(/^text-([a-zA-Z0-9-]+)(?:\/(\d+))?$/);
    if (textNamedMatch && colorPalette[textNamedMatch[1]]) {
      style.color = parseColorWithOpacity(textNamedMatch[1], textNamedMatch[2]);
      continue;
    }

    // Text sizes
    if (token === 'text-xs') { style.fontSize = 12; style.lineHeight = 16; continue; }
    if (token === 'text-sm') { style.fontSize = 14; style.lineHeight = 20; continue; }
    if (token === 'text-base') { style.fontSize = 16; style.lineHeight = 24; continue; }
    if (token === 'text-lg') { style.fontSize = 18; style.lineHeight = 28; continue; }
    if (token === 'text-xl') { style.fontSize = 20; style.lineHeight = 28; continue; }
    if (token === 'text-2xl') { style.fontSize = 24; style.lineHeight = 32; continue; }
    if (token === 'text-3xl') { style.fontSize = 30; style.lineHeight = 36; continue; }
    if (token === 'text-4xl') { style.fontSize = 36; style.lineHeight = 40; continue; }
    if (token === 'text-5xl') { style.fontSize = 48; style.lineHeight = 48; continue; }

    // Arbitrary font size: text-[10px], text-[32px], text-[58px]
    const fontSizeMatch = token.match(/^text-\[(\d+)px\]$/);
    if (fontSizeMatch) {
      const sz = parseInt(fontSizeMatch[1], 10);
      style.fontSize = sz;
      style.lineHeight = Math.round(sz * 1.25);
      continue;
    }

    // Text align
    if (token === 'text-center') { style.textAlign = 'center'; continue; }
    if (token === 'text-left') { style.textAlign = 'left'; continue; }
    if (token === 'text-right') { style.textAlign = 'right'; continue; }

    // Font weights
    if (token === 'font-normal') { style.fontWeight = '400'; continue; }
    if (token === 'font-medium') { style.fontWeight = '500'; continue; }
    if (token === 'font-semibold') { style.fontWeight = '600'; continue; }
    if (token === 'font-bold') { style.fontWeight = '700'; continue; }
    if (token === 'font-black') { style.fontWeight = '900'; continue; }

    // Flex layout
    if (token === 'flex') {
      style.display = 'flex';
      // In web Tailwind, 'flex' defaults to 'flex-direction: row'.
      // In React Native, View defaults to 'column'. So unless flex-col is specified, set row:
      if (!tokens.includes('flex-col') && !tokens.includes('flex-col-reverse')) {
        style.flexDirection = 'row';
      }
      continue;
    }
    if (token === 'flex-1') { style.flex = 1; continue; }
    if (token === 'flex-[2]') { style.flex = 2; continue; }
    if (token === 'flex-col') { style.flexDirection = 'column'; continue; }
    if (token === 'flex-row') { style.flexDirection = 'row'; continue; }
    if (token === 'flex-col-reverse') { style.flexDirection = 'column-reverse'; continue; }
    if (token === 'flex-row-reverse') { style.flexDirection = 'row-reverse'; continue; }
    if (token === 'flex-wrap') { style.flexWrap = 'wrap'; continue; }
    if (token === 'flex-nowrap') { style.flexWrap = 'nowrap'; continue; }
    if (token === 'shrink-0' || token === 'flex-shrink-0') { style.flexShrink = 0; continue; }
    if (token === 'shrink' || token === 'flex-shrink') { style.flexShrink = 1; continue; }
    if (token === 'grow' || token === 'flex-grow') { style.flexGrow = 1; continue; }
    if (token === 'grow-0' || token === 'flex-grow-0') { style.flexGrow = 0; continue; }

    // Alignment
    if (token === 'items-center') { style.alignItems = 'center'; continue; }
    if (token === 'items-start') { style.alignItems = 'flex-start'; continue; }
    if (token === 'items-end') { style.alignItems = 'flex-end'; continue; }
    if (token === 'items-stretch') { style.alignItems = 'stretch'; continue; }
    if (token === 'justify-center') { style.justifyContent = 'center'; continue; }
    if (token === 'justify-between') { style.justifyContent = 'space-between'; continue; }
    if (token === 'justify-start') { style.justifyContent = 'flex-start'; continue; }
    if (token === 'justify-end') { style.justifyContent = 'flex-end'; continue; }
    if (token === 'justify-around') { style.justifyContent = 'space-around'; continue; }
    if (token === 'self-start') { style.alignSelf = 'flex-start'; continue; }
    if (token === 'self-end') { style.alignSelf = 'flex-end'; continue; }
    if (token === 'self-center') { style.alignSelf = 'center'; continue; }
    if (token === 'self-stretch') { style.alignSelf = 'stretch'; continue; }
    if (token === 'self-auto') { style.alignSelf = 'auto'; continue; }

    // Sizing
    if (token === 'w-full') { style.width = '100%'; continue; }
    if (token === 'h-full') { style.height = '100%'; continue; }
    if (token === 'w-auto') { style.width = 'auto'; continue; }
    if (token === 'h-auto') { style.height = 'auto'; continue; }
    if (token === 'min-h-screen') { style.flex = 1; continue; }
    if (token === 'min-w-0') { style.minWidth = 0; continue; }
    if (token === 'min-h-0') { style.minHeight = 0; continue; }

    if (token === 'w-1/2') { style.width = '50%'; continue; }
    if (token === 'w-1/3') { style.width = '33.333%'; continue; }
    if (token === 'w-2/3') { style.width = '66.667%'; continue; }
    if (token === 'w-1/4') { style.width = '25%'; continue; }
    if (token === 'w-3/4') { style.width = '75%'; continue; }

    // max-w presets
    if (token === 'max-w-xs') { style.maxWidth = 320; continue; }
    if (token === 'max-w-sm') { style.maxWidth = 384; continue; }
    if (token === 'max-w-md') { style.maxWidth = 448; continue; }
    if (token === 'max-w-lg') { style.maxWidth = 512; continue; }
    if (token === 'max-w-xl') { style.maxWidth = 576; continue; }
    if (token === 'max-w-2xl') { style.maxWidth = 672; continue; }

    // Numeric width/height: w-12, h-12, w-2.5, h-3.5
    const wMatch = token.match(/^w-(\d+(?:\.\d+)?)$/);
    if (wMatch) { style.width = parseFloat(wMatch[1]) * 4; continue; }

    const hMatch = token.match(/^h-(\d+(?:\.\d+)?)$/);
    if (hMatch) { style.height = parseFloat(hMatch[1]) * 4; continue; }

    const maxHMatch = token.match(/^max-h-(\d+(?:\.\d+)?)$/);
    if (maxHMatch) { style.maxHeight = parseFloat(maxHMatch[1]) * 4; continue; }

    const minHMatch = token.match(/^min-h-(\d+(?:\.\d+)?)$/);
    if (minHMatch) { style.minHeight = parseFloat(minHMatch[1]) * 4; continue; }

    // Arbitrary pixel sizing: min-h-[115px], max-w-[130px], h-[72px], etc.
    const arbMinH = token.match(/^min-h-\[(\d+)px\]$/);
    if (arbMinH) { style.minHeight = parseInt(arbMinH[1], 10); continue; }

    const arbMaxH = token.match(/^max-h-\[(\d+)px\]$/);
    if (arbMaxH) { style.maxHeight = parseInt(arbMaxH[1], 10); continue; }

    const arbH = token.match(/^h-\[(\d+)px\]$/);
    if (arbH) { style.height = parseInt(arbH[1], 10); continue; }

    const arbW = token.match(/^w-\[(\d+)px\]$/);
    if (arbW) { style.width = parseInt(arbW[1], 10); continue; }

    const arbMinW = token.match(/^min-w-\[(\d+)px\]$/);
    if (arbMinW) { style.minWidth = parseInt(arbMinW[1], 10); continue; }

    const arbMaxW = token.match(/^max-w-\[(\d+)px\]$/);
    if (arbMaxW) { style.maxWidth = parseInt(arbMaxW[1], 10); continue; }

    // Positioning
    if (token === 'relative') { style.position = 'relative'; continue; }
    if (token === 'absolute') { style.position = 'absolute'; continue; }
    if (token === 'fixed') { style.position = 'absolute'; continue; }
    if (token === 'inset-0') { style.top = 0; style.bottom = 0; style.left = 0; style.right = 0; continue; }
    if (token === 'inset-x-0') { style.left = 0; style.right = 0; continue; }
    if (token === 'inset-y-0') { style.top = 0; style.bottom = 0; continue; }
    if (token === 'top-0') { style.top = 0; continue; }
    if (token === 'bottom-0') { style.bottom = 0; continue; }
    if (token === 'left-0') { style.left = 0; continue; }
    if (token === 'right-0') { style.right = 0; continue; }

    const posMatch = token.match(/^(top|bottom|left|right)-(\d+(?:\.\d+)?)$/);
    if (posMatch) {
      const [, prop, val] = posMatch;
      const num = parseFloat(val) * 4;
      if (prop === 'top') style.top = num;
      else if (prop === 'bottom') style.bottom = num;
      else if (prop === 'left') style.left = num;
      else if (prop === 'right') style.right = num;
      continue;
    }

    if (token === 'overflow-hidden') { style.overflow = 'hidden'; continue; }

    // Z-Index
    const zMatch = token.match(/^z-(\d+)$/);
    if (zMatch) { style.zIndex = parseInt(zMatch[1], 10); continue; }

    // Opacity
    const opMatch = token.match(/^opacity-(\d+)$/);
    if (opMatch) { style.opacity = parseInt(opMatch[1], 10) / 100; continue; }

    // Padding & Margin (4px multiplier, supports decimals)
    const pMatch = token.match(/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(\d+(?:\.\d+)?)$/);
    if (pMatch) {
      const [, prop, val] = pMatch;
      const num = parseFloat(val) * 4;
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

    if (token === 'mx-auto') { style.marginHorizontal = 'auto'; continue; }
    if (token === 'my-auto') { style.marginVertical = 'auto'; continue; }
    if (token === 'mt-auto') { style.marginTop = 'auto'; continue; }
    if (token === 'mb-auto') { style.marginBottom = 'auto'; continue; }
    if (token === 'ml-auto') { style.marginLeft = 'auto'; continue; }
    if (token === 'mr-auto') { style.marginRight = 'auto'; continue; }

    // Gap
    const gapMatch = token.match(/^gap-(\d+(?:\.\d+)?)$/);
    if (gapMatch) {
      style.gap = parseFloat(gapMatch[1]) * 4;
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

    // Border Width
    if (token === 'border') { style.borderWidth = 1; continue; }
    if (token === 'border-0') { style.borderWidth = 0; continue; }
    if (token === 'border-2') { style.borderWidth = 2; continue; }
    if (token === 'border-3') { style.borderWidth = 3; continue; }
    if (token === 'border-4') { style.borderWidth = 4; continue; }
    if (token === 'border-8') { style.borderWidth = 8; continue; }
    if (token === 'border-t') { style.borderTopWidth = 1; continue; }
    if (token === 'border-t-2') { style.borderTopWidth = 2; continue; }
    if (token === 'border-b') { style.borderBottomWidth = 1; continue; }
    if (token === 'border-b-2') { style.borderBottomWidth = 2; continue; }
    if (token === 'border-b-3') { style.borderBottomWidth = 3; continue; }
    if (token === 'border-dashed') { style.borderStyle = 'dashed'; continue; }

    // Hex border: border-[#1A2B4C] or border-[#1A2B4C]/20
    const borderHexMatch = token.match(/^border-\[#([0-9a-fA-F]+)\](?:\/(\d+))?$/);
    if (borderHexMatch) {
      style.borderColor = parseColorWithOpacity('#' + borderHexMatch[1], borderHexMatch[2]);
      continue;
    }
    // Named border: border-white/20, border-slate-700
    const borderNamedMatch = token.match(/^border-([a-zA-Z0-9-]+)(?:\/(\d+))?$/);
    if (borderNamedMatch && colorPalette[borderNamedMatch[1]]) {
      style.borderColor = parseColorWithOpacity(borderNamedMatch[1], borderNamedMatch[2]);
      continue;
    }

    // Shadow: hard drop shadows shadow-[3px_3px_0px_#1A2B4C]
    const hardShadow = token.match(/^shadow-\[(\d+)px_(\d+)px_0px_([#0-9a-zA-Z]+)\]$/);
    if (hardShadow) {
      style.shadowColor = hardShadow[3];
      style.shadowOffset = { width: parseInt(hardShadow[1], 10), height: parseInt(hardShadow[2], 10) };
      style.shadowOpacity = 1;
      style.shadowRadius = 0;
      style.elevation = parseInt(hardShadow[2], 10) + 1;
      continue;
    }
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
 * Splits styles between outer ScrollView and its contentContainerStyle
 */
export function splitScrollViewStyles(styles: any[], hasFlex1: boolean, isHorizontal: boolean) {
  const flatten = StyleSheet.flatten(styles) || {};
  const outerStyle: any = {};
  const contentStyle: any = {};

  if (hasFlex1 || flatten.flex !== undefined) {
    outerStyle.flex = flatten.flex !== undefined ? flatten.flex : 1;
    contentStyle.flexGrow = 1;
  } else {
    contentStyle.flexGrow = 0;
  }

  if (isHorizontal) {
    contentStyle.flexDirection = 'row';
    contentStyle.alignItems = flatten.alignItems || 'center';
  }

  const contentKeys = new Set([
    'alignItems',
    'justifyContent',
    'flexDirection',
    'flexWrap',
    'padding',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingHorizontal',
    'paddingVertical',
    'gap',
    'rowGap',
    'columnGap',
  ]);

  for (const key of Object.keys(flatten)) {
    if (contentKeys.has(key)) {
      contentStyle[key] = flatten[key];
    } else {
      outerStyle[key] = flatten[key];
    }
  }

  return { outerStyle, contentStyle };
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

  const isHorizontalScroll = typeof className === 'string' && /\boverflow-x-(auto|scroll)\b/.test(className);
  const isVerticalScroll = typeof className === 'string' && /\boverflow(-y)?-(auto|scroll)\b/.test(className) && !isHorizontalScroll;
  const isScrollable = isHorizontalScroll || isVerticalScroll;

  if (isScrollable && !onClick && !onPress) {
    const hasFlex1 = typeof className === 'string' && (/\bflex-1\b/.test(className) || /\bmin-h-screen\b/.test(className) || /\bh-full\b/.test(className));
    const { outerStyle, contentStyle } = splitScrollViewStyles(computedStyle, hasFlex1, isHorizontalScroll);

    return (
      <ScrollView
        ref={ref}
        horizontal={isHorizontalScroll}
        style={outerStyle}
        contentContainerStyle={[contentStyle, props.contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={!isHorizontalScroll}
        showsHorizontalScrollIndicator={isHorizontalScroll}
        {...props}
      >
        {wrapChildren(children)}
      </ScrollView>
    );
  }

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

const ButtonTextColorContext = React.createContext<string | null>(null);

export const Button = React.forwardRef<any, any>(({ className, style, children, onClick, onPress, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <button ref={ref} className={className} style={style} onClick={onClick || onPress} {...props}>{children}</button>;
  }
  const parsed = parseTailwind(className);
  const buttonColor = parsed.color || (typeof className === 'string' && className.includes('text-white') ? '#ffffff' : null);
  return (
    <ButtonTextColorContext.Provider value={buttonColor}>
      <TouchableOpacity ref={ref} activeOpacity={0.7} onPress={onClick || onPress} style={[parsed, style]} {...props}>
        {wrapChildren(children, { color: buttonColor || '#ffffff', fontWeight: 'bold' })}
      </TouchableOpacity>
    </ButtonTextColorContext.Provider>
  );
});
Button.displayName = 'Button';

export const Span = React.forwardRef<any, any>(({ className, style, children, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return <span ref={ref} className={className} style={style} {...props}>{children}</span>;
  }
  const inheritedColor = React.useContext(ButtonTextColorContext);
  const parsed = parseTailwind(className);
  const textStyle = [
    inheritedColor && !parsed.color ? { color: inheritedColor } : null,
    parsed,
    style,
  ];
  return <Text ref={ref} style={textStyle} {...props}>{children}</Text>;
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
      style={[{ padding: 12, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, fontSize: 16, color: '#1A2B4C' }, parseTailwind(className), style]}
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

// Android‑only Select component (Expo Go on Android)
export const Select = React.forwardRef<any, any>(
  ({ children, className, style, onChange, value, ...props }, ref) => {
    if (Platform.OS === 'web') {
      return (
        <select ref={ref} className={className} style={style} value={value} onChange={onChange} {...props}>
          {children}
        </select>
      );
    }
    const handleValueChange = (val: any) => {
      onChange?.({ target: { value: val } } as any);
    };
    const parsedStyle = parseTailwind(className);
    return (
      <View style={[{ borderRadius: 12, borderWidth: 2, borderColor: '#1A2B4C', backgroundColor: '#FAF7F2', overflow: 'hidden', justifyContent: 'center' }, parsedStyle, style]}>
        <Picker
          ref={ref}
          selectedValue={value}
          onValueChange={handleValueChange}
          style={{ height: 50, width: '100%', color: '#1A2B4C' }}
          dropdownIconColor="#1A2B4C"
          mode="dropdown"
          {...props}
        >
          {children}
        </Picker>
      </View>
    );
  },
);
Select.displayName = 'Select';

function extractNodeText(node: any): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractNodeText).join('');
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return extractNodeText((node.props as any).children);
  }
  return '';
}

// Android‑only Option component (always a Picker.Item)
export const Option = ({ children, value, label, ...props }: any) => {
  const computedLabel = label || extractNodeText(children) || (value !== undefined ? String(value) : '');
  return <Picker.Item label={computedLabel} value={value} {...props} />;
};
Option.displayName = 'Option';

// Strong text component (bold)
export const Strong = React.forwardRef<any, any>(({ children, className, style, ...props }, ref) => {
  if (Platform.OS === 'web') {
    return (
      <strong className={className} style={style} {...props}>
        {children}
      </strong>
    );
  }
  // On native platforms, render as Text with bold style
  return (
    <Text
      ref={ref}
      style={[{ fontWeight: 'bold' }, parseTailwind(className), style]}
      {...props}
    >
      {children}
    </Text>
  );
});
Strong.displayName = 'Strong';

export const Main = Div;
export const Header = Div;
export const Footer = Div;
export const Section = Div;
export const Nav = Div;
export const Aside = Div;
export const Ul = Div;
export const Li = Div;
export const Form = Div;
