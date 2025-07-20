# 🌐 CanSat NeXT Translations

This repository contains machine-generated and manually refined translations for the [CanSat NeXT](https://cansat-next.com) documentation site.

Our goal is to make CanSat NeXT accessible in multiple languages for students and educators around the world. Initial translations are generated automatically, but we rely on **your feedback and corrections** to ensure clarity and accuracy.

## 🗣 Contribute a Translation

We welcome your help improving existing translations or adding new ones!

### How to Help
- **Spot a mistake?** Open an issue or send us an email (see below).
- **Want to improve a whole file?** Fork this repo and open a pull request.
- **Want to add a new language?** Please contact us first to coordinate.

### File Types

#### JSON files

Most UI text and metadata are stored in JSON files in the Docusaurus i18n format:

```json
{
"theme.blog.authorsList.pageTitle": {
"message": "Kirjoittajat",
"description": "The title of the authors page"
}
}
```

Only the `"message"` field should be translated. Please **do not modify brand names**, product names (e.g., *CanSat NeXT*, *GitHub*), or placeholders like `{example}`.

#### Markdown files

Content pages (such as documentation and blog posts) are translated using Markdown (`.md` or `.mdx`) files. These are located under:

```
i18n/<lang-code>/docusaurus-plugin-content-docs/current/
i18n/<lang-code>/docusaurus-plugin-content-blog/
```

When translating these files:
- Keep the original Markdown formatting (headings, links, images, etc.).
- Do not translate filenames or front matter keys (e.g., `id`, `slug`, `tags`).
- You may translate headings and inline content freely, unless they include code or technical identifiers.

## 💬 Feedback

If you notice issues in the translated content or want to help with corrections:

- 📧 Email: [support@kitsat.fi](mailto:support@kitsat.fi?subject=Translation%20Feedback)
- 📄 Translation Help Page: [CanSat Translation Guide](https://cansat-next.com/docs/translate-help)

## 📜 License

Translations are shared under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license unless otherwise noted.
