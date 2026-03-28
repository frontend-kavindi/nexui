# NexUI Sync - Figma Plugin

A powerful Figma plugin that synchronizes design tokens from your GitHub repository to Figma Variables, ensuring consistency between your design system and codebase.

## Features

- 🔄 **Automatic Sync**: Fetch tokens from GitHub and sync to Figma Variables
- 🎨 **Variable Collections**: Organized collections for Colors, Spacing, and Typography
- 📊 **Diff Preview**: See changes before applying them
- 🔐 **Secure Storage**: GitHub PAT stored securely in Figma client storage
- ⚡ **Real-time Updates**: Live preview of token changes
- 🎯 **TypeScript**: Zero `any` types, full type safety
- 🚀 **Modern API**: Uses Figma Variables API for future-proof token management

## Installation

1. Clone this repository
2. Navigate to the plugin directory:
   ```bash
   cd packages/figma-plugin
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Build the plugin:
   ```bash
   pnpm build
   ```

## Usage

### 1. Setup GitHub Token

Create a GitHub Personal Access Token with repository access:
- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate new token with `repo` scope
- Copy the token (starts with `ghp_`)

### 2. Configure Plugin

1. Open Figma and go to Plugins → Development → Import plugin from manifest
2. Select the `packages/figma-plugin` directory
3. Open the NexUI Sync plugin
4. Enter your GitHub PAT and tokens URL
5. Click "Save Configuration"

### 3. Token JSON Format

Your `tokens.json` file should follow this structure:

```json
{
  "colors": {
    "primary": {
      "type": "color",
      "value": "#667eea",
      "description": "Primary brand color"
    }
  },
  "spacing": {
    "sm": {
      "type": "spacing", 
      "value": 8,
      "unit": "px",
      "description": "Small spacing"
    }
  },
  "typography": {
    "body": {
      "type": "typography",
      "value": {
        "fontFamily": "Inter",
        "fontSize": 16,
        "fontWeight": 400,
        "lineHeight": 1.5
      },
      "description": "Body text"
    }
  }
}
```

### 4. Sync Tokens

1. Click "Fetch Tokens" to retrieve the latest tokens
2. Review the token preview showing counts
3. See the diff of changes (added/modified/removed)
4. Click "Apply Changes" to sync to Figma Variables

## File Structure

```
packages/figma-plugin/
├── src/
│   ├── ui.html          # Plugin UI interface
│   ├── code.ts           # Main plugin logic
│   └── types.ts         # TypeScript definitions
├── dist/                 # Built plugin files
├── manifest.json         # Figma plugin manifest
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── tokens.example.json   # Example token structure
```

## Development

### Build Commands

```bash
# Build the plugin
pnpm build

# Watch for changes during development
pnpm dev

# Install dependencies
pnpm install
```

### Testing in Figma

1. Run `pnpm dev` to enable watch mode
2. In Figma: Plugins → Development → Reload plugin
3. Test functionality with the example tokens file

## Architecture Decisions

### Why Variables API over Styles API?

The plugin uses Figma's **Variables API** instead of the legacy **Styles API** for these reasons:

1. **Future-Proof**: Variables API is the modern, recommended approach
2. **Better Organization**: Collections and semantic naming
3. **Theme Support**: Built-in modes for light/dark themes
4. **Type Safety**: Strong typing for different token types
5. **Cross-References**: Variables can reference other variables
6. **Precision**: Numeric values for spacing (vs. limited style properties)
7. **Programmatic Control**: Better API for automation
8. **Design System Integration**: Designed specifically for token management

### Token Types Supported

- **Colors**: Hex values → Figma Color Variables
- **Spacing**: Numeric values (px/rem) → Figma Float Variables  
- **Typography**: Font objects → Figma String Variables

### Error Handling

- Token structure validation
- Network error handling
- Figma API error recovery
- User-friendly error messages

## Security

- GitHub PAT stored in Figma client storage (encrypted)
- Network access restricted to GitHub domains only
- No token data sent to external servers
- Local processing only

## Troubleshooting

### Common Issues

1. **"Failed to fetch tokens"**: Check GitHub token permissions and URL
2. **"Invalid token structure"**: Verify JSON format matches expected schema
3. **"Variable creation failed"**: Ensure Figma file has edit permissions
4. **Build errors**: Run `pnpm install` to update dependencies

### Debug Mode

Enable console logging in Figma:
1. Open Figma DevTools (Ctrl+Shift+I)
2. Check Console tab for plugin messages
3. Look for detailed error information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with full TypeScript coverage
4. Test thoroughly in Figma
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the example tokens file for format reference
