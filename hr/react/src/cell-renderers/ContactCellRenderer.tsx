import { type FunctionComponent } from "react";

import type { CustomCellRendererProps } from "ag-grid-react";

import styles from "./ContactCellRenderer.module.css";

export const ContactCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ data }) => {
  const orgLabel = data?.orgHierarchy?.at(-1);
  if (!orgLabel) {
    return null;
  }
  const emailName = orgLabel.toLowerCase().replace(" ", ".");

  return (
    <div className={styles.contactCell}>
      <div className={styles.iconContainer}>
        <a
          href="https://www.linkedin.com/company/ag-grid/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
          aria-label="LinkedIn"
        >
          <img
            className={styles.icon}
            src={`/example/hr/linkedin.svg`}
            alt="linkedin"
          />
        </a>
        <a
          href={`mailto:${emailName}@company.com`}
          className={styles.iconLink}
          aria-label="Email"
        >
          <img
            className={styles.icon}
            src={`/example/hr/email.svg`}
            alt="email"
          />
        </a>
      </div>
    </div>
  );
};
