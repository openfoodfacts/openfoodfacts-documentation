# GitHub Actions Workflows for Fumadocs Conversion

This directory contains GitHub Actions workflows that automatically convert Markdown files to Fumadocs-compatible format using the [fumadocs-transpiler](https://www.npmjs.com/package/fumadocs-transpiler) npm package.

## 📋 Available Workflows

### 1. 🤖 Automatic Conversion (`fumadocs-transpiler.yml`)

**Triggers:**

- Push to `main`/`master` branch with changes to `docs/**/*.md`
- Pull requests with changes to `docs/**/*.md`
- Manual trigger via workflow dispatch

**Features:**

- ✅ Automatically converts `.md` files to `.mdx` format
- ✅ Validates markdown syntax before conversion
- ✅ Creates backup files of original markdown
- ✅ Commits changes automatically (on push events)
- ✅ Creates pull requests (on PR events)
- ✅ Uploads conversion artifacts
- ✅ Provides detailed conversion summary

**Usage:**
This workflow runs automatically when you push changes to markdown files in the `docs` directory.

### 2. 🛠️ Manual Conversion (`manual-fumadocs-conversion.yml`)

**Triggers:**

- Manual trigger only (workflow dispatch)

**Features:**

- 🎛️ Configurable source and output directories
- 🔍 Dry run mode to preview changes
- ✅ Validation-only mode
- 📝 Custom configuration support
- 💾 Optional backup creation
- 📊 Detailed conversion reports

**Usage:**

1. Go to **Actions** tab in your repository
2. Select **Manual Fumadocs Conversion**
3. Click **Run workflow**
4. Configure options:
   - **Source directory**: Directory to convert (default: `docs`)
   - **Output directory**: Where to save converted files (empty = in-place)
   - **Dry run**: Preview changes without writing files
   - **Create backup**: Backup original files
   - **Validate only**: Only check files without converting
   - **Custom config**: JSON configuration (optional)

### 3. 🔍 Validation Only (`validate-markdown.yml`)

**Triggers:**

- Push to `main`/`master` branch with changes to any `.md` files
- Pull requests with changes to any `.md` files

**Features:**

- ✅ Validates markdown files for Fumadocs compatibility
- 🔍 Checks annotation syntax
- 📊 Provides validation summary
- ⚡ Fast validation without conversion

**Usage:**
This workflow runs automatically to validate markdown files before they're converted.

## 🔧 Configuration

### Default Configuration

All workflows use a default configuration that supports:

```json
{
  "componentMappings": {
    "callout-info": "<Callout type=\"info\">{{content}}</Callout>",
    "callout-warn": "<Callout type=\"warn\">{{content}}</Callout>",
    "callout-error": "<Callout type=\"error\">{{content}}</Callout>",
    "callout-note": "<Callout type=\"note\">{{content}}</Callout>",
    "tip": "<Callout type=\"info\">{{content}}</Callout>",
    "warning": "<Callout type=\"warn\">{{content}}</Callout>",
    "danger": "<Callout type=\"error\">{{content}}</Callout>"
  },
  "preserveOriginal": false,
  "outputExtension": ".mdx",
  "imports": [
    "import { Callout } from 'fumadocs-ui/components/callout';",
    "import { Tabs, Tab } from 'fumadocs-ui/components/tabs';",
    "import { Steps, Step } from 'fumadocs-ui/components/steps';",
    "import { Accordions, Accordion } from 'fumadocs-ui/components/accordion';",
    "import { CodeBlock } from 'fumadocs-ui/components/codeblock';",
    "import { Files, File } from 'fumadocs-ui/components/files';",
    "import { Banner } from 'fumadocs-ui/components/banner';"
  ],
  "backupOriginal": true,
  "validateSyntax": true
}
```

### Custom Configuration

For the manual workflow, you can provide custom configuration in JSON format:

```json
{
  "componentMappings": {
    "custom-alert": "<Alert type=\"{{type}}\">{{content}}</Alert>",
    "my-component": "<MyComponent>{{content}}</MyComponent>"
  },
  "outputExtension": ".mdx",
  "backupOriginal": false
}
```

## 📝 Supported Annotations

The workflows support all fumadocs-transpiler annotations:

### Callouts

```markdown
:::callout-info
Information message
:::

:::callout-warn
Warning message
:::

:::callout-error
Error message
:::

:::callout-note
Note message
:::
```

### Tabs

```markdown
:::tabs
Tab 1|Content for tab 1
Tab 2|Content for tab 2
:::
```

### Steps

```markdown
:::steps
Step 1: First step description
Step 2: Second step description
:::
```

### Accordion

```markdown
:::accordion
Question 1|Answer to question 1
Question 2|Answer to question 2
:::
```

### Code Blocks

```markdown
:::code-block lang="javascript" title="Example"
console.log('Hello World');
:::
```

### File Trees

```markdown
:::files
src/
components/
Button.tsx
pages/
index.tsx
:::
```

### Banners

```markdown
:::banner type="info"
Important announcement
:::
```

## 🚀 Getting Started

1. **Enable workflows**: These workflows are ready to use once you commit them to your repository.

2. **Test validation**: Push a change to any markdown file to trigger validation.

3. **Run manual conversion**: Use the manual workflow to convert your existing markdown files.

4. **Customize as needed**: Modify the workflows to match your repository structure and requirements.

## 📊 Workflow Outputs

### Artifacts

- **Converted files**: All `.mdx` files generated
- **Backup files**: Original `.md` files (if backup enabled)
- **Configuration**: The configuration used for conversion
- **Reports**: Detailed conversion reports (manual workflow)

### Summaries

Each workflow provides detailed summaries including:

- Number of files processed
- Conversion statistics
- Error reports (if any)
- Links to relevant resources

## 🔗 Resources

- 📦 [fumadocs-transpiler on npm](https://www.npmjs.com/package/fumadocs-transpiler)
- 📚 [Fumadocs Documentation](https://fumadocs.vercel.app/)
- 🛠️ [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Contributing

To improve these workflows:

1. Fork the repository
2. Make your changes
3. Test the workflows
4. Submit a pull request

## 📞 Support

If you encounter issues with these workflows:

1. Check the workflow logs for detailed error messages
2. Validate your markdown files manually using the CLI
3. Create an issue in the repository with workflow logs

---

**Happy documenting with Fumadocs! 🚀**
