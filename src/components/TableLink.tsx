import Link from "next/link";
import React, { ReactNode } from "react";

const TableLink = ({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <td className={className}>
      <Link href={to}>{children}</Link>
    </td>
  );
};

export default TableLink;
