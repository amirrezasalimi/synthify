Synthify: Generate Synthesized Datasets with a No-Code UI

![Synthify]![image](https://github.com/user-attachments/assets/830ebb48-3ca1-40aa-b7ed-a988cd34e97c))

### Quick Start Guide

Welcome to Synthify! Follow these steps to get started quickly:

#### clone the repository:

```bash
git clone https://github.com/amirrezasalimi/synthify.git
cd synthify
```

#### Step 1: Setting up Domains

To run Synthify locally, you'll need to set up some fake domains.
   
### Then, follow these steps to set up the domains:

1. **For macOS:**

   - Open Terminal.
   - Type `sudo nano /etc/hosts` and press Enter.
   - Add these lines to the end of the file:
     ```
     127.0.0.1 synthify.co pb.synthify.co backend.synthify.co party.synthify.co
     ```
   - Save and exit.

2. **For Windows and Linux:**
   - Google "How to edit hosts file [your operating system]" for instructions.

#### Step 2: Running Synthify

Now, let's start Synthify using Docker:

1. Make sure you have Docker installed. If not, download and install it from [here](https://www.docker.com/get-started).

2. Open Terminal or Command Prompt.

3. Type `docker-compose up -d` and press Enter.

#### Step 3: Enjoy Synthify!

1. Open [http://synthify.co](http://synthify.co) in your browser.

2. Set up a user.

3. You're all set to enjoy Synthify!

### Contributing

We love contributions! Feel free to open issues, submit pull requests, or suggest new features on our [GitHub repository](https://github.com/amirrezasalimi/synthify).

### License

Synthify is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode). Refer to the [LICENSE](LICENSE) file for more details.

This license allows you to share and adapt the material for non-commercial purposes under certain conditions.
