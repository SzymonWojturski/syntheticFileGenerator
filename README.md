# syntheticFileGenerator  

A tool for generating synthetic files with cryptocurrency transaction data.  

## Notes  

- The parameters entered in the built desktop application control how the synthetic transaction files are generated.  
- For example, you can specify the number of transactions, date ranges, or output file formats.  
- The application uses these inputs to generate files according to the selected options.  

## Requirements  

- Node.js  
- Python  

## How to build  

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/SzymonWojturski/syntheticFileGenerator.git
   cd syntheticFileGenerator
   ```

2. **Run the build:**  
   - **Windows**  
     ```bash
     npm run build:windows
     ```
   - **Linux**  
     ```bash
     npm run build:linux
     ```
   - **Mac**  
     ```bash
     npm run build:mac
     ```

   > ⚠️ In some cases, you may be prompted to confirm with **y** during the process (but not always).  

3. **Result:**  
   - After a successful build, a **dist** directory will appear in the project root, containing the generated artifacts (such as `.exe`, `.zip`).  
   - These files can then be executed or distributed.  
