# {Page Name} ({page-route})

## Route
- Path: /module/page
- Auth required: Yes / No

## Layout

### Header
{Describe navigation bar / search / action bar}

### Main Content
{Describe the main content area structure}

```
┌──────────────────────────┐
│  Header / Nav            │
├──────────────────────────┤
│                          │
│  Main Content Area       │
│                          │
├──────────────────────────┤
│  Footer / Actions        │
└──────────────────────────┘
```

### Footer (if applicable)
{Describe bottom action bar / buttons}

## Components
| Component | Description | Exists? |
|-----------|-------------|---------|
| ExampleCard | Card for displaying items | ❌ |

## API Dependencies
| Endpoint | Method | Types | Description |
|----------|--------|-------|-------------|
| /example | GET | ExampleQuery → ExampleResponse | Fetch list |

## Interactions
- Click card → navigate to detail
- Pull to refresh → reload page 1
- Scroll to bottom → load next page

## Design Reference
- See `docs/design/design-tokens.md`
- Screenshots: place in same directory as `screenshot-{page}.png`
