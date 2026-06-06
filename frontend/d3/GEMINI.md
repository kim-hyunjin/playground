# Project Instructions

## Code Style & Documentation
- **Comment Preservation**: Always preserve original explanatory comments in D3 components. These comments often contain crucial information about the physical simulation logic and D3-specific implementations.
- **Refactoring**: When refactoring D3 components, prefer breaking down the visualization logic into smaller, focused functions (e.g., `initSimulation`, `drawLinks`, `drawNodes`) to improve readability and testability.
- **D3 Data Handling**: Always create deep copies of data before passing it to D3 simulations to prevent side effects on React props or state.
