import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side={side} className={cn("flex w-[--sidebar-width] flex-col bg-sidebar p-0", className)}>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-state={state}
      data-variant={variant}
      className={cn(
        "relative flex h-full flex-col",
        variant === "sidebar" && "w-[--sidebar-width] data-[state=collapsed]:w-[--sidebar-width-icon]",
        variant === "floating" && "absolute inset-y-4 left-4 z-50 w-[--sidebar-width] rounded-lg border bg-sidebar shadow-lg data-[state=collapsed]:w-[--sidebar-width-icon]",
        variant === "inset" && "w-[--sidebar-width] data-[state=collapsed]:w-[--sidebar-width-icon]",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("flex h-14 items-center px-4", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarHeaderTitle = React.forwardRef(({ className, ...props }, ref) => {
  return <h2 className={cn("flex w-full items-center gap-2 truncate text-lg font-semibold tracking-tight", className)} ref={ref} {...props} />;
});
SidebarHeaderTitle.displayName = "SidebarHeaderTitle";

const SidebarContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 overflow-hidden", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarSearch = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className={cn("px-4", className)}>
      <Input type="search" placeholder="Search..." className="h-9" ref={ref} {...props} />
    </div>
  );
});
SidebarSearch.displayName = "SidebarSearch";

const SidebarSection = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col gap-4 px-4", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
SidebarSection.displayName = "SidebarSection";

const SidebarSectionTitle = React.forwardRef(({ className, ...props }, ref) => {
  return <h3 className={cn("text-sm font-medium text-muted-foreground/70", className)} ref={ref} {...props} />;
});
SidebarSectionTitle.displayName = "SidebarSectionTitle";

const SidebarNav = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <nav className={cn("-mx-2 flex flex-1 flex-col gap-1 overflow-auto", className)} ref={ref} {...props}>
      {children}
    </nav>
  );
});
SidebarNav.displayName = "SidebarNav";

const SidebarNavItem = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  const { state } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Comp className={cn("group flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground [&[data-active]]:bg-accent [&[data-active]]:text-accent-foreground", className)} ref={ref} {...props}>
          {children}
        </Comp>
      </TooltipTrigger>
      {state === "collapsed" && (
        <TooltipContent side="right" sideOffset={5}>
          {children}
        </TooltipContent>
      )}
    </Tooltip>
  );
});
SidebarNavItem.displayName = "SidebarNavItem";

const SidebarNavItemChildren = React.forwardRef(({ className, children, ...props }, ref) => {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1 pl-6", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
SidebarNavItemChildren.displayName = "SidebarNavItemChildren";

const SidebarNavItemIcon = React.forwardRef(({ className, ...props }, ref) => {
  return <span className={cn("h-4 w-4 shrink-0", className)} ref={ref} {...props} />;
});
SidebarNavItemIcon.displayName = "SidebarNavItemIcon";

const SidebarNavItemChevron = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return null;
  }

  return <span className={cn("ml-auto h-3 w-3 shrink-0 text-muted-foreground/50", className)} ref={ref} {...props} />;
});
SidebarNavItemChevron.displayName = "SidebarNavItemChevron";

const SidebarNavItemTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return null;
  }

  return <span className={cn("flex-1 truncate", className)} ref={ref} {...props} />;
});
SidebarNavItemTitle.displayName = "SidebarNavItemTitle";

const SidebarFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("mt-auto flex flex-col gap-4 px-4 py-4", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarCollapse = React.forwardRef(({ className, ...props }, ref) => {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" className={cn("h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground", className)} onClick={toggleSidebar} ref={ref} {...props}>
      <PanelLeft className={cn("h-4 w-4 rotate-0 transition-transform", state === "collapsed" && "rotate-180")} />
    </Button>
  );
});
SidebarCollapse.displayName = "SidebarCollapse";

export { Sidebar, SidebarProvider, SidebarHeader, SidebarHeaderTitle, SidebarContent, SidebarSearch, SidebarSection, SidebarSectionTitle, SidebarNav, SidebarNavItem, SidebarNavItemChildren, SidebarNavItemIcon, SidebarNavItemChevron, SidebarNavItemTitle, SidebarFooter, SidebarCollapse };
