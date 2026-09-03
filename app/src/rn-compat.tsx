import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Re-export standard React Native Web mobile primitives
export {
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
} from 'react-native';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mobile Haptic feedback utility
 * Works natively on mobile devices (Android/iOS PWA) & fallback on browsers
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' | 'error' = 'light') {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(15);
          break;
        case 'medium':
          navigator.vibrate(30);
          break;
        case 'heavy':
          navigator.vibrate([60, 40, 60]);
          break;
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'error':
          navigator.vibrate([80, 50, 80, 50, 100]);
          break;
      }
    } catch {
      // Ignored if browser permissions prevent vibration
    }
  }
}

export const Div = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
);
Div.displayName = 'Div';

export const Span = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      {children}
    </span>
  )
);
Span.displayName = 'Span';

export const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={className} {...props}>
      {children}
    </p>
  )
);
P.displayName = 'P';

export const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h1 ref={ref} className={className} {...props}>
      {children}
    </h1>
  )
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h2 ref={ref} className={className} {...props}>
      {children}
    </h2>
  )
);
H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={className} {...props}>
      {children}
    </h3>
  )
);
H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h4 ref={ref} className={className} {...props}>
      {children}
    </h4>
  )
);
H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h5 ref={ref} className={className} {...props}>
      {children}
    </h5>
  )
);
H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h6 ref={ref} className={className} {...props}>
      {children}
    </h6>
  )
);
H6.displayName = 'H6';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, children, ...props }, ref) => (
    <label ref={ref} className={className} {...props}>
      {children}
    </label>
  )
);
Label.displayName = 'Label';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={className} {...props}>
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export const Img = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt = '', ...props }, ref) => (
    <img ref={ref} alt={alt} className={className} {...props} />
  )
);
Img.displayName = 'Img';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={className} {...props} />
  )
);
Input.displayName = 'Input';

export const Main = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <main ref={ref} className={className} {...props}>
      {children}
    </main>
  )
);
Main.displayName = 'Main';

export const Header = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <header ref={ref} className={className} {...props}>
      {children}
    </header>
  )
);
Header.displayName = 'Header';

export const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <footer ref={ref} className={className} {...props}>
      {children}
    </footer>
  )
);
Footer.displayName = 'Footer';

export const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  )
);
Section.displayName = 'Section';

export const Nav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <nav ref={ref} className={className} {...props}>
      {children}
    </nav>
  )
);
Nav.displayName = 'Nav';

export const Aside = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <aside ref={ref} className={className} {...props}>
      {children}
    </aside>
  )
);
Aside.displayName = 'Aside';

export const Ul = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => (
    <ul ref={ref} className={className} {...props}>
      {children}
    </ul>
  )
);
Ul.displayName = 'Ul';

export const Li = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={className} {...props}>
      {children}
    </li>
  )
);
Li.displayName = 'Li';

export const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, children, ...props }, ref) => (
    <form ref={ref} className={className} {...props}>
      {children}
    </form>
  )
);
Form.displayName = 'Form';
