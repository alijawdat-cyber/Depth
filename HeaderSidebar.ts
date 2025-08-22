// HeaderSidebar.ts - نسخة TypeScript بدون dependencies خارجية

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

interface HeaderSidebarConfig {
  navigation: NavigationItem[];
  githubUrl?: string;
  className?: string;
}

class HeaderSidebar {
  private container: HTMLElement;
  private navigation: NavigationItem[];
  private githubUrl: string;
  private sidebarOpen: boolean = false;
  private scrolled: boolean = false;
  
  // DOM elements
  private header: HTMLElement | null = null;
  private sidebar: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private hamburgerBtn: HTMLButtonElement | null = null;
  private breadcrumbsList: HTMLElement | null = null;

  constructor(container: HTMLElement | string, config: HeaderSidebarConfig) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement 
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.navigation = config.navigation;
    this.githubUrl = config.githubUrl || 'https://github.com/alijawdat-cyber/Depth';
    
    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
    this.updateBreadcrumbs();
  }

  private render(): void {
    const html = this.generateHTML();
    this.container.innerHTML = html;
    
    // Cache DOM elements
    this.header = this.container.querySelector('.header-sidebar-header');
    this.sidebar = this.container.querySelector('.header-sidebar-nav');
    this.overlay = this.container.querySelector('.sidebar-overlay');
    this.hamburgerBtn = this.container.querySelector('.hamburger-btn');
    this.breadcrumbsList = this.container.querySelector('.breadcrumbs-list');
  }

  private generateHTML(): string {
    return `
      <!-- Header -->
      <header class="header-sidebar-header" role="banner">
        <div class="header-content">
          <!-- Hamburger Menu Button - Right -->
          <button
            class="hamburger-btn"
            aria-expanded="false"
            aria-controls="main-sidebar"
            aria-label="فتح القائمة الجانبية"
          >
            ${this.getMenuIcon()}
            ${this.getCloseIcon()}
          </button>

          <!-- Breadcrumbs - Center -->
          <nav class="breadcrumbs-nav" aria-label="Breadcrumb" role="navigation">
            <ol class="breadcrumbs-list">
              <!-- Breadcrumbs will be populated by JavaScript -->
            </ol>
          </nav>

          <!-- GitHub Link - Left -->
          <a
            href="${this.githubUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
            aria-label="عرض على GitHub"
          >
            ${this.getGithubIcon()}
          </a>
        </div>
      </header>

      <!-- Sidebar Overlay - Mobile -->
      <div class="sidebar-overlay" aria-hidden="true"></div>

      <!-- Sidebar -->
      <aside
        id="main-sidebar"
        class="header-sidebar-nav sidebar-closed"
        role="navigation"
        aria-label="القائمة الرئيسية"
        aria-hidden="true"
      >
        <div class="sidebar-content">
          <!-- Sidebar Header -->
          <div class="sidebar-header">
            <h2 class="sidebar-title">القائمة الرئيسية</h2>
            <button class="sidebar-close-btn" aria-label="إغلاق القائمة الجانبية">
              ${this.getCloseIcon()}
            </button>
          </div>

          <!-- Navigation Menu -->
          <nav class="sidebar-nav" role="navigation">
            <ul class="nav-list">
              ${this.generateNavigationHTML()}
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Content Spacer -->
      <div class="header-spacer" aria-hidden="true"></div>
    `;
  }

  private generateNavigationHTML(): string {
    return this.navigation.map(item => this.renderNavItem(item, 0)).join('');
  }

  private renderNavItem(item: NavigationItem, level: number): string {
    const isActive = this.isActivePath(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const padding = 16 + (level * 16);

    let html = `
      <li class="nav-item nav-item-level-${level}">
        <a
          href="${item.href}"
          class="nav-link ${isActive ? 'nav-link-active' : ''}"
          style="padding-right: ${padding}px;"
        >
          ${item.label}
        </a>
    `;

    if (hasChildren) {
      html += `
        <ul class="nav-submenu">
          ${item.children!.map(child => this.renderNavItem(child, level + 1)).join('')}
        </ul>
      `;
    }

    html += '</li>';
    return html;
  }

  private isActivePath(href: string): boolean {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === href;
  }

  private generateBreadcrumbs(): BreadcrumbItem[] {
    if (typeof window === 'undefined') {
      return [{ label: 'Home', href: '/', isLast: true }];
    }

    const pathname = window.location.pathname;
    
    if (!pathname || pathname === '/') {
      return [{ label: 'Home', href: '/', isLast: true }];
    }

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', isLast: false }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Clean segment name for display
      const cleanSegment = segment
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/^\d+[\-\s]*/, '') // Remove leading numbers
        .trim();

      breadcrumbs.push({
        label: cleanSegment,
        href: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  }

  private updateBreadcrumbs(): void {
    if (!this.breadcrumbsList) return;

    const breadcrumbs = this.generateBreadcrumbs();
    
    this.breadcrumbsList.innerHTML = breadcrumbs.map(crumb => {
      if (!crumb.isLast) {
        return `
          <li class="breadcrumb-item">
            <a href="${crumb.href}" class="breadcrumb-link">${crumb.label}</a>
            <span class="breadcrumb-separator" aria-hidden="true">›</span>
          </li>
        `;
      } else {
        return `
          <li class="breadcrumb-item">
            <span class="breadcrumb-current" aria-current="page">${crumb.label}</span>
          </li>
        `;
      }
    }).join('');
  }

  private bindEvents(): void {
    // Hamburger button
    this.hamburgerBtn?.addEventListener('click', () => this.toggleSidebar());
    
    // Sidebar close button
    const closeBtn = this.container.querySelector('.sidebar-close-btn');
    closeBtn?.addEventListener('click', () => this.toggleSidebar());
    
    // Overlay click
    this.overlay?.addEventListener('click', () => this.toggleSidebar());
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebarOpen) {
        this.toggleSidebar();
      }
    });

    // Scroll effect
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Close sidebar on navigation (mobile)
    this.sidebar?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('nav-link') && window.innerWidth <= 768) {
        setTimeout(() => this.toggleSidebar(), 150);
      }
    });

    // Handle route changes (for SPA)
    window.addEventListener('popstate', () => this.updateBreadcrumbs());
  }

  private toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    
    if (!this.sidebar || !this.hamburgerBtn) return;

    const menuIcon = this.hamburgerBtn.querySelector('.lucide-menu') as HTMLElement;
    const closeIcon = this.hamburgerBtn.querySelector('.lucide-x') as HTMLElement;

    if (this.sidebarOpen) {
      this.sidebar.classList.remove('sidebar-closed');
      this.sidebar.classList.add('sidebar-open');
      this.hamburgerBtn.setAttribute('aria-expanded', 'true');
      this.hamburgerBtn.setAttribute('aria-label', 'إغلاق القائمة الجانبية');
      this.sidebar.setAttribute('aria-hidden', 'false');
      
      if (menuIcon) menuIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
    } else {
      this.sidebar.classList.remove('sidebar-open');
      this.sidebar.classList.add('sidebar-closed');
      this.hamburgerBtn.setAttribute('aria-expanded', 'false');
      this.hamburgerBtn.setAttribute('aria-label', 'فتح القائمة الجانبية');
      this.sidebar.setAttribute('aria-hidden', 'true');
      
      if (menuIcon) menuIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }
  }

  private handleScroll(): void {
    const shouldScroll = window.scrollY > 10;
    if (shouldScroll !== this.scrolled) {
      this.scrolled = shouldScroll;
      this.header?.classList.toggle('header-scrolled', this.scrolled);
    }
  }

  // SVG Icons
  private getMenuIcon(): string {
    return `
      <svg class="lucide lucide-menu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" x2="20" y1="6" y2="6"/>
        <line x1="4" x2="20" y1="12" y2="12"/>
        <line x1="4" x2="20" y1="18" y2="18"/>
      </svg>
    `;
  }

  private getCloseIcon(): string {
    return `
      <svg class="lucide lucide-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
        <path d="m18 6-12 12"/>
        <path d="m6 6 12 12"/>
      </svg>
    `;
  }

  private getGithubIcon(): string {
    return `
      <svg class="lucide lucide-github" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
      </svg>
    `;
  }

  // Public API methods
  public updateNavigation(navigation: NavigationItem[]): void {
    this.navigation = navigation;
    const navList = this.container.querySelector('.nav-list');
    if (navList) {
      navList.innerHTML = this.generateNavigationHTML();
    }
  }

  public closeSidebar(): void {
    if (this.sidebarOpen) {
      this.toggleSidebar();
    }
  }

  public openSidebar(): void {
    if (!this.sidebarOpen) {
      this.toggleSidebar();
    }
  }

  public destroy(): void {
    // Remove all event listeners and clean up
    this.container.innerHTML = '';
  }
}

// Usage example:
/*
const navigation = [
  {
    id: 'home',
    label: 'الرئيسية',
    href: '/',
  },
  {
    id: 'docs',
    label: 'التوثيق',
    href: '/documentation',
    children: [
      {
        id: 'overview',
        label: 'نظرة عامة',
        href: '/documentation/overview'
      }
    ]
  }
];

const headerSidebar = new HeaderSidebar('#header-container', {
  navigation,
  githubUrl: 'https://github.com/your-repo'
});
*/

export default HeaderSidebar;
