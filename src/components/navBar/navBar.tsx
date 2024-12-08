import Link from "next/link";

export default function NavBar({
  navItems,
  navFooterItems,
}: {
  navItems: {
    name: string;
    href: string;
  }[];
  navFooterItems?: {
    name: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href + item.name}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
        {navFooterItems && (
          <div>
            {navFooterItems.map((item) => (
              <Link key={item.href + item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
