import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Rakitianskyi Stanislav</p>
          <p>
            Contact us: <a href="mailto:raketaswig@gmail.com" target="_blank">Email</a>
          </p>
        </div>
      </div>
    </footer>
  );
}