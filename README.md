An Among-Us notes tool with a variety of features to help you win matches and play detective. Made to be compatible with Linux and Windows. 

Current feature set includes:
- The Other Roles or Town Of Us: Mira colour sets
- Lobby settings memorisation panel
- Nuanced alignment selection
- Per player notes
- Per player vent tracking

Planned features include:
- Per round map UI usable to track player and body locations across every round
- Modded roles panel that displays every role from your selected mod, potentially draggable onto player cards

Building from source: 
1. Make sure rust is installed on your system as outlined by Tauri's prerequisites
2. Open terminal in an empty folder and run: ```git clone https://github.com/DCoder200/TrusTissue-notes.git```
3. Open the project root with an application such as VS-code or similar and run: ```npm install```
4. To launch a development app preview run: ```npx tauri dev```
5. To build the project run: ```npx tauri build``` (executable will be in /src-tauri/targets)

UI preview:
<img width="960" height="604" alt="image" src="https://github.com/user-attachments/assets/e3f0edb7-a6bc-400d-ad99-906afa2c6174" />

