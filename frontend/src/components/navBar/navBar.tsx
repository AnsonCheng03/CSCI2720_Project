export default function NavBar({
  navItems,
}: {
  navItems: {
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
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
