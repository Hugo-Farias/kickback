// global.d.ts

interface Navigation extends EventTarget {
  readonly currentEntry: NavigationHistoryEntry | null;
  readonly transition: NavigationTransition | null;
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;

  back(options?: NavigationOptions): Promise<void>;
  forward(options?: NavigationOptions): Promise<void>;
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult;
  reload(options?: NavigationReloadOptions): NavigationResult;
  traverseTo(key: string, options?: NavigationOptions): Promise<void>;

  entries(): NavigationHistoryEntry[];
}

interface NavigationHistoryEntry extends EventTarget {
  readonly id: string;
  readonly key: string;
  readonly url: string;
  readonly index: number;
  readonly sameDocument: boolean;
  readonly historyState: any;

  getState(): any;
}

interface NavigationTransition {
  readonly navigationType: string;
  readonly from: NavigationHistoryEntry;
  readonly finished: Promise<void>;
}

interface NavigationOptions {
  info?: any;
}

interface NavigationNavigateOptions extends NavigationOptions {
  state?: any;
  history?: "auto" | "push" | "replace";
}

interface NavigationReloadOptions extends NavigationOptions {
  state?: any;
}

interface NavigationResult {
  committed: Promise<NavigationHistoryEntry>;
  finished: Promise<NavigationHistoryEntry>;
}

interface NavigateEvent extends Event {
  readonly navigationType: string;
  readonly destination: NavigationHistoryEntry;
  readonly canIntercept: boolean;
  readonly userInitiated: boolean;
  readonly hashChange: boolean;
  readonly signal: AbortSignal;
  readonly formData?: FormData;

  intercept(options?: {
    handler?: () => Promise<void> | void;
    focusReset?: "after-transition" | "manual";
    scroll?: "after-transition" | "manual";
  }): void;
}

interface Window {
  navigation: Navigation;
}

interface WindowEventMap {
  navigate: NavigateEvent;
}
