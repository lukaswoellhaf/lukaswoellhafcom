import React from 'react';
import styles from './ContactInfo.module.css';

interface ContactMethod {
  type: string;
  label: string;
  value: string;
}

interface ContactInfoProps {
  contactMethods: ContactMethod[];
  title?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  contactMethods,
  title = 'Contact',
}) => {
  const getContactLink = (method: ContactMethod) => {
    if (method.type === 'email') {
      return `mailto:${method.value}`;
    }
    return method.value;
  };

  const getTarget = (method: ContactMethod) => {
    return method.type === 'email' ? undefined : '_blank';
  };

  const getRel = (method: ContactMethod) => {
    return method.type === 'email' ? undefined : 'noopener noreferrer';
  };

  return (
    <section className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <ul className={styles.list}>
        {contactMethods.map((method, index) => (
          <li key={index} className={styles.item}>
            <a
              href={getContactLink(method)}
              target={getTarget(method)}
              rel={getRel(method)}
              className={styles.link}
            >
              <span className={styles.label}>→ {method.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
