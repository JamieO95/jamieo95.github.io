---
layout: post
title:  "Hosting a local 'AI' platform"
description: "This is a tutorial for installing PewDiePie's Odysseus and an Ollama LLM model for hosting your own 'AI'"
keywords: "proxmox, virtual environment, pve, virtual machine, ubuntu server, how to, tutorial, tech, it, ollama, odysseus, pewdiepie, llama3.2, localhost, loopback, openssh, ssh, docker, configuration"
subtitle: "Odysseus and Ollama LLMs"
date:   2026-06-26 10:00:00 +0100
category: homelab
author: "Jamie"
permalink: "/blog/hosting-a-local-ai-platform"
---

Hello, friends. I did something a little different today and thought it'd be fun to do a write-up. We all know about ChatGPT, Gemini, Copilot - but how about <a href="https://ollama.com" target="_blank">Ollama?</a> Ollama is an open-source framework that gets gives you the ability to run large language models (LLMs) from your own devices. We can technically interface with it directly in a terminal, but I thought I'd use the opportunity to also test out something fresh and unexpected, PewDiePie's Odysseus. This will allow us to interface with Ollama's LLMs in a nice chat window, like you're probably used to. Let's get to it.

Requirements:
- A device to install on to, I've chosen to do this on a Ubuntu Virtual Machine (VM)
- Minimum 8GB RAM (I've tried this on both 4GB and 6GB. It.. technically works?)
- Minimum 4vCPUs (2 didn't work :))
- 40GB disk space
- (Optional) A second device on the same network. As I'm using Ubuntu Server with no desktop environment installed, I won't be able to bring up a web browser for Odysseus. You're welcome to install a desktop environment to avoid this optional extra!

1) Configuring the VM. I'm using Proxmox Virtual Environment 9.2.2.
As above, set your VM to have 8GB RAM and 4 vCPUs, and give yourself a spacious 40GB disk. The library I'm using for this demo was too chunky for my first attempt on a 32GB so I had to bump it up. If you want to have more than 1 model, you may want to allow some more headroom, we're pushing the boundaries of minimum with this 40GB. If you want a full walk through of making the VM and installing Ubuntu, just head here: <a href="/blog/creating-a-vm-in-proxmox-ve" target="_blank">Creating a VM in Proxmox VE</a>

I'm going to use PuTTY to make my life easier, being able to actually scroll through the terminal logs makes this worth it. You just need to make sure OpenSSH is installed on your Ubuntu terminal, run the following commands to install it:

Update your package repository to the latest version

<pre><code>sudo apt update</code></pre>

Update all the install packages to the latest version (the -y flag just bypasses you pressing Y to confirm installation)

<pre><code>sudo apt upgrade -y</code></pre>

Install the OpenSSH server package

<pre><code>sudo apt install openssh-server</code></pre>

If you don't know the IP address of your VM, use the following to get a print out. Keep a note, you'll need this a few times.

<pre><code>ip addr</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/1.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/2.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/3.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

2) Time for Ollama, let's get our LLM backbone installed. Head to the <a href="https://ollama.com/download/linux" target="_blank">Ollama Downloads page</a> and click on the chosen OS, in my case, Linux. Copy the command and pop it into your Ubuntu PuTTY terminal. You can hit a right-click whilst the PuTTY window is active to paste the command right in. It'll take a few minutes so just sit tight. You'll know you're done when you see the "Install complete" line in your terminal.

The command for Linux, at the time of writing, is below

<pre><code>curl -fsSL https://ollama.com/install.sh | sh</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/4.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>
<figure>
    <img src="/assets/2026-06-26/installing-ollama/5.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

For me, I want to be able to access Ollama from outside of this VM. It will install by default with only loopback (**127.0.0.1**) access, which will make this unusable for me. We need to make a small change to the Ollama service. Follow along if you need this too, or jump to 2.2!

First, run the systemctl edit command to get into the service configuration

<pre><code>sudo systemctl edit ollama</code></pre>

Add the following lines, just below the first comment. This will redirect from loopback to using the IP address of the VM. You'll be in the Nano editor, use your keyboard's arrow keys to navigate around.

<pre><code>[Service]<br>
Environment="OLLAMA_HOST=0.0.0.0:11434"</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/6.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Use the keybinds CTRL+S to save your changes, and CTRL+X to get out of the Nano editor.

We need a model for Ollama to use. There's.. a ton. I used llama3.2 for my testing, so I'll stick to that. You can find a whole list of models <a href="https://ollama.com/library" target="_blank">here</a> if you want to explore, just substitute the model you want to use in commands.

We can grab a model by running the following. Again, give it a couple of minutes! You'll see "**success**" when it finishes up.

<pre><code>ollama pull llama3.2</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/7.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Now, we should restart the Ollama service, since we made a change to it, and after we'll see if we're looking good.

<pre><code>sudo systemctl daemon-reload</code></pre>

<pre><code>sudo systemctl restart ollama</code></pre>

<pre><code>ollama list</code></pre>

<pre><code>curl http://&lt;server-ip&gt;:11434/api/tags</code></pre>

From <code>ollama list</code>, we should see the model we've installed. After running the curl command, we should see the model also. If you can curl it using the IP address, it means your change to the service worked a charm and it is now be exposed to your local network.

<figure>
    <img src="/assets/2026-06-26/installing-ollama/8.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Let's give it a quick test! You can do this right in your Ubuntu terminal.

<pre><code>ollama run llama3.2 "Type your message right here"</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-ollama/9.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

3) Hey, we're chugging along great. Time for Odyssesus so we can get out of the Terminal. I'm going to install Odysseus using Docker. 

There's plentiful documentation on the <a href="https://docs.docker.com/engine/install/ubuntu/" target="_blank">Docker website</a>. It's a bit fiddly, but they provide all the commands.

Install the GPG key

<pre><code>sudo install -m 0755 -d /etc/apt/keyrings</code></pre>

Grab their repository

<pre><code>sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc</code></pre>

Make the permissions accessible

<pre><code>sudo chmod a+r /etc/apt/keyrings/docker.asc</code></pre>

Add the repository to Apt sources (you definitely want to copy and paste this one...)

<pre><code>sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF</code></pre>

Update the Apt sources on the VM

<pre><code>sudo apt update</code></pre>

And, finally, install Docker and its components

<pre><code>sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin 
docker-compose-plugin</code></pre>

Docker **should** be running, but it sometimes need a bit of convincing.

<pre><code>sudo systemctl start docker</code></pre>

You can double check its status with

<pre><code>sudo systemctl status docker</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-odysseus/1.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

📝 Side note: I did originally do an install of this using sudo snap install docker and it worked flawlessly. Unfortunately, that didn't work this time, and there seemed to be a version difference that meant the commands required on Odysseus' launch failed. For safety, I'd recommend you just go straight for the full install route that Docker provide and not cut corners like myself!

4) Now Docker's installed, let's finally install Odysseus.

<a href="https://github.com/pewdiepie-archdaemon/odysseus/blob/dev/docs/setup.md" target="_blank">Odysseus' documentation</a> is pretty good, under Quick Start, I'll list the commands here, but you're welcome to take a look at the documentation in case there's anything different you'd like to do. This is where we'll first be making use of the terminal scrolling I mentioned, and why we're using PuTTY. The administrator password gets put into terminal as you fire up Odysseus, but there's quite verbose logging and you'll lose it very quickly. If you haven't swapped to PuTTY, or another SSH client, now's a great time.

First, clone the repository

<pre><code>git clone https://github.com/pewdiepie-archdaemon/odysseus.git</code></pre>

Jump into the directory

<pre><code>cd odysseus</code></pre>

Make a copy of the .env.example file, name it .env

<pre><code>cp .env.example .env</code></pre>

I need to make a change to the .env to expose it to my LAN, very similar to what we did with Ollama. Follow along if you need this too.

<pre><code>sudo nano .env</code></pre>

A ways down the file, you'll come to the Auth & Security section. You'll want to remove the **#** from in front of **APP_BIND** and replace **127.0.0.1** with your VMs IP address.

<figure>
    <img src="/assets/2026-06-26/installing-odysseus/2.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Again, CTRL+S to save, and CTRL+X to get out of Nano.

Time to build. There is a smaller build, but I'm using the second command here to get the optional extras so I can play with them later, perhaps in another post? You're welcome to use the smaller footprint version, the first command, if you so choose. It took about 6 minutes for my build.

<pre><code>sudo docker compose up -d --build</code></pre>


**OR**

<pre><code>sudo docker compose build --build-arg INSTALL_OPTIONAL=true</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-odysseus/3.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

If you've used the optional install, it shouldn't bring up the Docker container until you (following compose completing) run this command too

<pre><code>sudo docker compose up -d</code></pre>

The sequence appeared to have changed a bit on me between uses, I had to go into the docker logs to get my password. Follow along if needed. There's a few to go through but use my screenshot as a reference point, it's hiding in there somewhere.

<pre><code>sudo docker compose logs</code></pre>

<figure>
    <img src="/assets/2026-06-26/installing-odysseus/4.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

⚠️ Warning: This password only appears on first build/up. Grab it whilst you can!

4.1) It's time to jump into Odysseus. Head to http://<**server-ip**>:7000 in your nearest browser. Pop in your credentials to log in.

**Username**: admin

**Password**: randomly generated on build

<figure>
    <img src="/assets/2026-06-26/configuring-odysseus/1.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Although we installed Ollama and Llama3.2, it's not available until you tell it where to find it. In the bottom-right, where it says "Select model", click that to open the drop-down (or fly-up?), and hit the Plus (+) button to open the Model Settings menu.

<figure>
    <img src="/assets/2026-06-26/configuring-odysseus/2.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Under Add Local Models, enter the following:

http://<**server-ip**>:11434


You can hit Test to check if it will find your model, as per screenshot below. Click Add when it finds your model.

<figure>
    <img src="/assets/2026-06-26/configuring-odysseus/3.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

<figure>
    <img src="/assets/2026-06-26/configuring-odysseus/4.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Odysseus will then pick Llama3.2 (or your substitute model) automatically. Chat away.

<figure>
    <img src="/assets/2026-06-26/configuring-odysseus/5.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

We got a bit ahead of ourselves there, testing it out and seeing the magic happen. That temporary password will remain until you change it, and it's not very memorable. Head into the Settings cog wheel, and under Account, Change Password. Do it, you'll thank yourself later.

<figure>
    <img src="/assets/2026-06-26/configuring-odysseus/6.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

Thanks for following along. It's been fun, and I hope also helpful. Til next time.