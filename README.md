# 🌲 Forest Alert Kenya

Public dashboard for monitoring deforestation in Kenya's forests using satellite data.

## Overview

This project creates a public-facing interface for forest deforestation alerts, designed to complement the [PyEO (Python for Earth Observation)](https://github.com/clcr/pyeo) system developed by the University of Leicester in partnership with Kenya Forest Service.

### Problem Statement

The existing Forest Alert system sends deforestation alerts exclusively to Kenya Forest Service (KFS). When political pressure or government interests conflict with forest conservation, this single-channel approach creates a vulnerability. This dashboard provides:

- **Public transparency** - Civil society, journalists, and citizens can see alerts
- **Multi-stakeholder access** - Community Forest Associations (CFAs) receive direct notifications
- **Legal documentation** - Historical alerts can be exported for court cases
- **Independent verification** - Multiple data sources reduce manipulation risk

## Features

### Current (v0.1 - Demo)
- [x] Interactive map of Kenya with forest locations
- [x] Mock alert data for 8 major forests
- [x] Alert filtering by forest, confidence, type
- [x] Detail panel with forest info and civil society contacts
- [x] Mobile-responsive design
- [x] Search functionality

### Planned (v0.2)
- [ ] Global Forest Watch API integration
- [ ] Email/SMS alert subscriptions
- [ ] Historical timeline view
- [ ] Export alerts as CSV/PDF

### Planned (v0.3 - Leicester Integration)
- [ ] Live PyEO data feed
- [ ] Citizen ground-truthing reports
- [ ] Before/after satellite imagery
- [ ] Comparison view (GFW vs PyEO)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet + React-Leaflet
- **Icons**: Heroicons
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/forest-alert-kenya.git
cd forest-alert-kenya

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

## Data Sources

### Current
- **Mock Data**: Simulated alerts for demonstration purposes

### Planned Integration
- **PyEO/Forest Alert**: University of Leicester's Sentinel-2 based detection system
- **Global Forest Watch**: WRI's global deforestation monitoring API
- **GLAD Alerts**: University of Maryland forest loss data

## Forests Covered

| Forest | County | Area (ha) | Status |
|--------|--------|-----------|--------|
| Karura | Nairobi | 1,041 | Forest Reserve |
| Mau Complex | Nakuru/Narok | 273,000 | Forest Reserve |
| Aberdare | Nyeri/Nyandarua | 76,619 | National Reserve |
| Mt. Kenya | Multiple | 199,500 | National Reserve |
| Kakamega | Kakamega | 23,800 | National Reserve |
| Arabuko-Sokoke | Kilifi | 41,600 | Forest Reserve |
| Mt. Elgon | Trans Nzoia | 73,000 | National Reserve |
| Cherangani | Elgeyo-Marakwet | 114,000 | Forest Reserve |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Research Context

This project supports research on:
- Public access to forest monitoring data
- Community-based forest management
- Effectiveness of satellite-based early warning systems
- Transparency in environmental governance

### Related Publications
- Roberts, J.F. et al. (2022). "Pyeo: A Python package for near-real-time forest cover change detection from Earth observation using machine learning." *Computers & Geosciences*

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- **University of Leicester** - PyEO development and Forest Alert system
- **Kenya Forest Service** - Partnership and domain expertise
- **Global Forest Watch / WRI** - Open data and API access
- **European Space Agency** - Sentinel-2 satellite data

## Contact

For questions about this dashboard or collaboration opportunities:
- Open an issue on GitHub
- Email: [your-email]

---

*This is a demonstration project. Alert data shown is simulated and does not represent real deforestation events.*
