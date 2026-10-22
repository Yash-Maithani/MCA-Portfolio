# Yash Maithani — Developer Portfolio

[![Live Site](https://img.shields.io/badge/Live-yash--maithani.github.io-6366f1?style=for-the-badge&logo=githubpages&logoColor=white)](https://yash-maithani.github.io/MCA-Portfolio/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#tech-stack)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#tech-stack)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#tech-stack)

My personal portfolio website. I'm an MCA student at **Graphic Era University** working with Java, web technologies, Android and AI / computer vision.

**🔗 Live site: [yash-maithani.github.io/MCA-Portfolio](https://yash-maithani.github.io/MCA-Portfolio/)**

![Portfolio preview](assets/preview.png)

---

## Features

- **Responsive layout.** Works from 320px phones up to wide desktops, with a slide-out menu on mobile.
- **Dark / light theme.** Toggle in the navbar; the choice is remembered with `localStorage`.
- **Typing animation** in the hero that cycles through roles.
- **Active section highlighting** in the navbar using `IntersectionObserver`.
- **Working contact form.** Sends through [Formspree](https://formspree.io) when an endpoint is configured, otherwise opens the visitor's email app with the message pre-filled.
- **Accessible.** Visible keyboard focus styles, labelled form fields, ARIA labels on icon buttons, and a live region for form status messages.
- **No build step.** Plain HTML, CSS and JavaScript; no frameworks or dependencies to install.

## Projects Featured

| Project | Description | Tech | Code |
| --- | --- | --- | --- |
| **Face & Emotion Recognition** | Detects faces and classifies emotions from facial expressions in images and video. | Python, Computer Vision, AI | [Face-Insight](https://github.com/Yash-Maithani/Face-Insight) |
| **TraceX** | Batch traceability and inventory management system linking products to digital records. | Java, Spring Boot, MySQL, REST | [TraceX](https://github.com/Yash-Maithani/TraceX-Smart-Product-Traceability-and-Inventory-Management-System-) |
| **Java Programs** | Object-oriented Java applications covering classes, data structures and problem solving. | Java, OOP | [JAVA-PROGRAMS](https://github.com/Yash-Maithani/JAVA-PROGRAMS) |
| **Android Application** | Mobile app built with XML layouts, event handling and Java application logic. | Java, Android SDK, XML | — |
| **This Portfolio** | The site you're looking at. | HTML, CSS, JavaScript | [MCA-Portfolio](https://github.com/Yash-Maithani/MCA-Portfolio) |

## Tech Stack

- **HTML5** — semantic page structure
- **CSS3** — custom properties for theming, Grid and Flexbox layouts, media queries
- **JavaScript (ES6+)** — theme switching, typing effect, scroll spy, contact form handling
- **[Font Awesome](https://fontawesome.com)** icons and **[Google Fonts](https://fonts.google.com)** (Plus Jakarta Sans, JetBrains Mono)
- **GitHub Pages** for hosting

## Project Structure

```text
MCA-Portfolio/
├── index.html      # Page markup and content
├── style.css       # Styles, dark/light theme variables, responsive rules
├── script.js       # Theme toggle, mobile menu, typing effect, scroll spy, contact form
├── favicon.svg     # Site icon
└── assets/
    └── preview.png # Screenshot used in this README
```

## Running Locally

No installation needed. Clone the repo and open `index.html` in a browser, or serve it locally:

```bash
git clone https://github.com/Yash-Maithani/MCA-Portfolio.git
cd MCA-Portfolio
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Contact Form Setup

By default the form opens the visitor's email app. To receive messages directly:

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy the form's endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into the `data-endpoint` attribute of the `<form id="contactForm">` tag in `index.html`.

## Deployment

The site is served by GitHub Pages from the `main` branch root (**Settings → Pages → Deploy from a branch → `main` / `(root)`**). Every push to `main` redeploys it automatically within a minute or two.

## Contact

- **Email:** [yashmaithani425@gmail.com](mailto:yashmaithani425@gmail.com)
- **LinkedIn:** [linkedin.com/in/yash-maithani-64b970260](https://www.linkedin.com/in/yash-maithani-64b970260)
- **GitHub:** [@Yash-Maithani](https://github.com/Yash-Maithani)

## License

Distributed under the MIT License.
