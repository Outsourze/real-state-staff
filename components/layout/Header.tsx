"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

const links = [
  { label: "Home", href: "#home" },
  { label: "Our roles", href: "#roles" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const getHref = (href: string) =>
    href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
  const isActive = (href: string) =>
    href === "/contact"
      ? pathname === href
      : pathname === "/" && active === href;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 },
    );
    links
      .filter(({ href }) => href.startsWith("#"))
      .forEach(({ href }) => {
        const section = document.querySelector(href);
        if (section) observer.observe(section);
      });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    const media = matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  function navigate(href: string) {
    dialogRef.current?.close();
    setOpen(false);
    if (pathname === "/" && href.startsWith("#")) {
      requestAnimationFrame(() => {
        const target = document.querySelector(`${href} h1, ${href} h2`);
        if (target instanceof HTMLElement) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      });
    }
  }

  function closeMenu() {
    dialogRef.current?.close();
    setOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-container header-inner">
        <BrandLogo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={getHref(href)}
              className={`nav-link ${isActive(href) ? "is-active" : ""}`}
              aria-current={
                isActive(href)
                  ? href.startsWith("#")
                    ? "location"
                    : "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="button button--primary header-cta">
          Get started <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <button
          className="menu-toggle"
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={25} aria-hidden="true" />
        </button>
      </div>
      <dialog
        className="mobile-nav"
        id="mobile-navigation"
        ref={dialogRef}
        aria-labelledby="mobile-navigation-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClick={(event) => {
          if (
            event.target === event.currentTarget &&
            event.clientX < event.currentTarget.getBoundingClientRect().left
          )
            closeMenu();
        }}
      >
        <div className="mobile-nav__top">
          <p id="mobile-navigation-title">Explore Real Estate Staff</p>
          <button
            type="button"
            className="mobile-nav__close"
            aria-label="Close navigation"
            onClick={closeMenu}
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={getHref(href)}
              onClick={() => navigate(href)}
              aria-current={
                isActive(href)
                  ? href.startsWith("#")
                    ? "location"
                    : "page"
                  : undefined
              }
            >
              {label}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
          <Link
            href="/contact"
            className="button button--primary"
            onClick={() => navigate("/contact")}
          >
            Let’s build your team <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </nav>
        <p>Good people. A stronger business.</p>
      </dialog>
    </header>
  );
}
