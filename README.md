# Chitra

A browser-native, open-source AI photo booth for creating studio-quality passport and ID photos with zero API cost. Everything runs locally—no cloud uploads, no subscription fees, no external dependencies.

![Chitra - AI Photo Booth](https://img.shields.io/badge/License-MIT-green) ![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue)

## Why Chitra?

Whether you're running a photo studio, managing ID documentation, or just need professional passport photos, Chitra gives you powerful AI tools right in your browser. No hidden costs. No data sent anywhere. Just you and your photos.

### Key Features

- **Background Removal** — Intelligent AI-powered background removal using ONNX models running locally
- **Photo Beautification** — Enhance skin tone, adjust brightness, and fine-tune colors with real-time preview
- **Smart Cleanup** — Manual and automatic cleanup tools to remove unwanted elements
- **Custom Layouts** — Create multi-photo sheets for passport, visa, and ID photo requirements
- **Print-Ready Export** — Generate high-resolution output ready for printing or digital submission
- **Crop & Resize** — Precise control over photo dimensions with preset templates
- **Zero Dependencies** — Everything runs in your browser. No backend, no databases, no API keys

## What Makes Chitra Different

| Feature | Chitra | Cloud Photo Tools |
|---------|--------|------------------|
| Processing | Browser (ONNX) | Cloud servers |
| Cost | Free | Per-photo/subscription |
| Privacy | Local only | Uploaded to servers |
| Setup | One-click | Account required |
| Speed | Instant | Network dependent |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pratiklamichhane/chitra.git
cd chitra

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to get started.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js** — React framework for production
- **TypeScript** — Type-safe development
- **ONNX Runtime** — Browser-based AI inference for background removal
- **Canvas API** — Client-side image processing
- **Tailwind CSS** — Responsive UI styling

## Project Structure

```
components/          # React components for UI panels
composables/        # Reusable logic (Canvas, ONNX, Layout)
utils/             # Conversion and export utilities
public/            # ONNX models and WASM assets
app/               # Next.js app directory
```

## How It Works

1. **Upload** — Select or drag your photo
2. **Edit** — Remove backgrounds, beautify, and cleanup with AI assistance
3. **Layout** — Choose a template or create custom sheet layout
4. **Export** — Download as high-resolution JPEG or PDF for printing

All processing happens in your browser using WebAssembly and ONNX models. Your photos never leave your machine.

## Contributing

We love contributions! Whether it's bug fixes, new features, or UI improvements, you're welcome to help.

```bash
# Fork, clone, and create a feature branch
git checkout -b feature/your-feature

# Make your changes and push
git push origin feature/your-feature

# Open a pull request
```

## License

MIT License — See [LICENSE](LICENSE) file for details

## Roadmap

- [ ] Support for batch processing multiple photos
- [ ] Custom preset templates for different countries
- [ ] Face detection and auto-alignment
- [ ] Additional AI models for professional retouching
- [ ] Mobile-responsive design improvements

## Support

Found a bug or have a suggestion? [Open an issue](https://github.com/pratiklamichhane/chitra/issues) and let us know.

---

**Made with ❤️ for photographers, studios, and everyone who needs professional photos without the markup.**
