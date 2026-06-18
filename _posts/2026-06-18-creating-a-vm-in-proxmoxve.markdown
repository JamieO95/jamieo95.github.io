---
layout: post
title:  "Creating a VM in Proxmox VE"
subtitle: "A prequel to my next post"
date:   2026-06-18 10:00:00 +0100
category: website
author: "Jamie"
permalink: "/blog/creating-a-vm-in-proxmox-ve"
---

Hello! Today we're going to be creating a Virtual Machine (VM) using Proxmox Virtual Environment (PVE) 9.2.2. In my example, I'm going to be using Ubuntu, which you can download the latest version of Ubuntu Server from <a href="https://ubuntu.com/download" target="_blank">here</a>. Let's get started.

1) Download the latest ISO and drop it into your local storage on PVE. 
Head to the PVE node you're using by opening https://**\<server-ip>**:8006/. Log in using your user account (likely **root**) to get access to the web console.

Expand the node using the drop-down box right next to it, and click on the "local (**node name**)" storage tab.

<figure>
    <img src="/assets/2026-06-18/1.jpg"
         alt="PVE host is expanded, with local host storage highlighted">
    <figcaption>PVE host is expanded, with local host storage highlighted</figcaption>
</figure>

 On the ISO images tab, hit Upload. Pick the ISO you want to upload (I cheated, I already have it uploaded, so I chose something else for the screenshots!). 

 <figure>
    <img src="/assets/2026-06-18/2.jpg"
         alt="Showing the ISO Images screen, with the Upload button highlighted">
    <figcaption>Showing the ISO Images screen, with the Upload button highlighted</figcaption>
</figure>
 
<figure>
    <img src="/assets/2026-06-18/3.jpg"
         alt="Highlighting Select File, and the File Upload window to pick your ISO">
    <figcaption>Highlighting Select File, and the File Upload window to pick your ISO</figcaption>
</figure>

 Click Upload to begin the process of transferring the ISO from your local machine to the PVE node. Once you see that "TASK OK" at the end, you know you're golden.

 <figure>
    <img src="/assets/2026-06-18/4.jpg"
         alt="Showing the upload progress bar">
    <figcaption>Showing the upload progress bar</figcaption>
</figure>

 <figure>
    <img src="/assets/2026-06-18/5.jpg"
         alt="ISO image has successfully uploaded">
    <figcaption>ISO image has successfully uploaded</figcaption>
</figure>

2) Right-click the PVE node you uploaded the ISO to. In my case, I uploaded the ISO to pve02, so I right-click that and click Create VM.

 <figure>
    <img src="/assets/2026-06-18/6.jpg"
         alt="Expanded target PVE node with Create VM highlighted">
    <figcaption>Expanded target PVE node with Create VM highlighted</figcaption>
</figure>

On the General tab, set a VM ID (this is largely unimportant, it just needs to be unique to the node or cluster. In my case, I have 3 nodes, so I ID them respective of the node. i.e pve01 has 100 through 199, pve02 has 200 through 299). Put a name on there too. This is just a display name so you know what you're looking at; at a glance.

<figure>
    <img src="/assets/2026-06-18/7.jpg"
         alt="General tab, changing VM ID and VM Name">
    <figcaption>General tab, changing VM ID and VM Name</figcaption>
</figure>

On the OS tab, change the ISO image dropdown to the ISO you uploaded before.

<figure>
    <img src="/assets/2026-06-18/8.jpg"
         alt="OS tab, using the dropdown to select the ISO we've uploaded">
    <figcaption>OS tab, using the dropdown to select the ISO we've uploaded</figcaption>
</figure>

The System tab can be left as default, as shown below.

<figure>
    <img src="/assets/2026-06-18/9.jpg"
         alt="System tab, can be modified but I left as default">
    <figcaption>System tab, can be modified but I left as default</figcaption>
</figure>

On the Disks tab, make sure you pick the Storage pool you're looking for, in my case a Ceph High Availability pool, and change the Disk size (GiB) to your target size. I picked 40.

<figure>
    <img src="/assets/2026-06-18/10.jpg"
         alt="Disks tab, setting storage pool and disk size to use, in my case 40">
    <figcaption>Disks tab, setting storage pool and disk size to use, in my case 40</figcaption>
</figure>

For CPU configuration, you only need to touch the Sockets and Cores values. In most of your cases, I assume 1 socket and 2 to 4 cores is appropriate. I picked 4 as the VM I am creating has a higher hardware requirement. 

<figure>
    <img src="/assets/2026-06-18/11.jpg"
         alt="CPU tab, changing to 4 cores">
    <figcaption>CPU tab, changing to 4 cores</figcaption>
</figure>

In Memory, it's mostly exactly as you'd expect, utilize 1024***\<target GB, i.e 8>** to calculate the Memory (MiB). My suggestion, turn off Ballooning Device. Ballooning means that, if required, the VM is allowed to go past the 8192 (8GB) that I have set.

<figure>
    <img src="/assets/2026-06-18/12.jpg"
         alt="Memory tab, changing to 8192MB and disabling ballooning">
    <figcaption>Memory tab, changing to 8192MB and disabling ballooning</figcaption>
</figure>

For Network, if you have nothing special set up, just pick your bridge network to get straight to your internet. This will likely be labelled as vmbr0 or vmbr1. I have a VXLAN set up, and a DHCP server that understands VLAN ID 20, so I've picked those. The Firewall flag is optional, I have no specific Firewall settings set up in PVE so I've unchecked it anyway. 

<figure>
    <img src="/assets/2026-06-18/13.jpg"
         alt="Network tab, picking the device that connects me to my LAN and disabling Firewall">
    <figcaption>Network tab, picking the device that connects me to my LAN and disabling Firewall</figcaption>
</figure>

All done! You've created a VM in PVE, well done. Give it a moment, it'll appear underneath your node, and then you can click on it to check the settings - here's a capture of my Hardware settings in full. Head to the Console tab and fire it up.

<figure>
    <img src="/assets/2026-06-18/14.jpg"
         alt="Hardware summary following the settings we selected">
    <figcaption>Hardware summary following the settings we selected</figcaption>
</figure>

Fancy some extracurricular reading? I'll continue on with my Ubuntu install as I go.

3) Time to make use of our VM container. Let's start installing Ubuntu Server 24.04. When you inevitably end up on a later version, just know the install process probably hasn't changed! For the most part, we're going to be doing a lot of next > next > next here.

Using your arrow keys, navigate up and down the menu to pick the language you're looking for. Here, I'll pick English (UK). Press Enter to continue.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/1.jpg"
         alt="Ubuntu's welcome screen, picking the langauge appropriate">
    <figcaption>Ubuntu's welcome screen, picking the langauge appropriate</figcaption>
</figure>

If you're not on the latest version of your current major version, you'll get this additional prompt. This is assuming you have network access at this stage, of course, but I'll be updating mine right here.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/2.jpg"
         alt="Check for new versions of the Ubuntu OS">
    <figcaption>Check for new versions of the Ubuntu OS</figcaption>
</figure>

You get some addtional keyboard options based on the language you selected. It's safe to assume these are appropriate for you, like mine were, so you can just continue on. Hitting Identify Keyboard will attempt to detect your layout automatically, if it hasn't already.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/3.jpg"
         alt="Keyboard options, starting with the appropriate one for the language">
    <figcaption>Keyboard options, starting with the appropriate one for the language</figcaption>
</figure>

You can choose between Ubuntu Server and Ubuntu Server (minimized) here. As the description states, it'll keep back a few of the bells and whistles for a smaller disk size, improving speed and efficiency. I haven't tested it myself, nor did I manage to find any official documentation on it (Is Ubuntu Minimal the same thing even?), but there are some blog posts out there that detail the RAM footprint of both. It's quite a percentage decrease.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/4.jpg"
         alt="Picking between Ubuntu Server and Ubuntu Server (minimized)">
    <figcaption>Picking between Ubuntu Server and Ubuntu Server (minimized)</figcaption>
</figure>

If you have a nice network set up, or a cobbled together one like me, you might get right onto a DHCP lease and be able to continue on right out of the gate. Or, you may wish to set a static IP address, as you typically should with a server. Alternatively, if you want to remain on the DHCP leasing, set a reservation for it on your DHCP server.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/5.jpg"
         alt="Network options, picking between DHCP and Static">
    <figcaption>Network options, picking between DHCP and Static</figcaption>
</figure>

In case you want/need to set a static IP address, use your keyboard arrow keys to navigate up to the network card. Hit enter, and go down to Edit IPv4.


<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/5.1.jpg"
         alt="Editing the IPv4 on your network card">
    <figcaption>Editing the IPv4 on your network card</figcaption>
</figure>

Set that IPv4 Method to Manual and enter your network details. If you're just connecting this to your home's LAN, you can work out your Subnet, and Address you can assign, Gateway and ISPs Name Servers by running a Command Prompt window, and typing:

<code>ipconfig /all</code>

**Subnet**: The full network/subnet you're using. E.g. **192.168.1.0/24**

**Address**: The IP address to assign, this must exist within the above subnet. E.g. **192.168.1.10**

**Gateway**: The Gateway IP address, such as your ISP router. E.g. **192.168.1.1**

**Name servers**: You have more flexibility here. Use your ISPs DNS or something public, like Google's **8.8.8.8** or Cloudflare's **1.1.1.1** (comma separated for multiple)

Search domains: You can leave this blank, but this will append the text in this field to local DNS queries. E.g. **home.local**. if you were to ping BestRouterHere, it would automatically append to **BestRouterHere.home.local**

You'll know you're good on these settings if it says "Done" instead of "Continue without Network".

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/5.2.jpg"
         alt="Configuring networking through manual IPv4 assignments">
    <figcaption>Configuring networking through manual IPv4 assignments</figcaption>
</figure>

I have no need for a proxy to get through to the internet, and you're likely the same. I'm afraid this one's out of my league for now, godspeed if you do require a proxy! I'm hitting Done to continue on.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/6.jpg"
         alt="If needed, you can configure a proxy address here">
    <figcaption>If needed, you can configure a proxy address here</figcaption>
</figure>

Let Ubuntu do its thing here, if you get through to "Reading package lists..." then you're on the Internet, well done. Hit Done to conitnue.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/7.jpg"
         alt="Ubuntu attempting to reach the internet and read package lists">
    <figcaption>Ubuntu attempting to reach the internet and read package lists</figcaption>
</figure>

There's no need for a custom storage layout for me on this VM, I want to use the entire 40GB disk I assigned, so I'm hitting Done.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/8.jpg"
         alt="Storage configuration, if you need to do anything fancy">
    <figcaption>Storage configuration, if you need to do anything fancy</figcaption>
</figure>

A summary of what we've done with our disks... which was nothing! Ubuntu is handling this for us. Hit Done.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/9.jpg"
         alt="Confirming your storage option choices, with myself on defaults">
    <figcaption>Confirming your storage option choices, with myself on defaults</figcaption>
</figure>

There's a final confirm before it starts rewriting the disk structure for Ubuntu's install. If you're doing nothing special here, like myself, just hit Continue. If you're doing something like a dual boot or have multiple drives in general, please double check your partitions and target disks, we can't be losing your other data!

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/10.jpg"
         alt="Final chance to go back and modify your storage settings, don't lose data!">
    <figcaption>Final chance to go back and modify your storage settings, don't lose data!</figcaption>
</figure>

And we get to set up our access. Most of this is self explanatory, but I'd just confirm that "Your name" is your display name, "Pick a username" is what you'll use to sign into the system when we're done. For me, I kept them the same. Hit Done to continue.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/11.jpg"
         alt="Profile configuration, setting a username and password">
    <figcaption>Profile configuration, setting a username and password</figcaption>
</figure>

We're almost done here, I promise. I'm sure Ubuntu Pro is a great platform, but unless you plan on shelling out some cash, select **Skip for now** and Continue.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/12.jpg"
         alt="Option for utilizing Ubuntu Pro, but we're skipping for now">
    <figcaption>Option for utilizing Ubuntu Pro, but we're skipping for now</figcaption>
</figure>

If you're not planning on using any form of Desktop environment, like myself, do yourself a favour and select **Install OpenSSH server*. This will allow you to connect to your terminal via PuTTY or another SSH client, giving you more customization and, importantly, the ability to scroll back up the terminal window. If you ever use commands that print out a ton of information, you'll want this. Hit Done to continue.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/13.jpg"
         alt="Installing OpenSSH server for future terminal interactions">
    <figcaption>Installing OpenSSH server for future terminal interactions</figcaption>
</figure>

There's an offer to preload a bunch of snaps, but I don't need any of them. Feel free to look through. Hit Done to start your install.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/14.jpg"
         alt="Picking from some optional extras that Ubuntu provide for the out-of-box experience">
    <figcaption>Picking from some optional extras that Ubuntu provide for the out-of-box experience</figcaption>
</figure>

It'll take a bit depending on your hardware, but you'll know you're done when you can see **Reboot Now** at the bottom. Hit it and let's roll.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/15.jpg"
         alt="Ubuntu has finished installing and we can reboot the system">
    <figcaption>Ubuntu has finished installing and we can reboot the system</figcaption>
</figure>

In case you bump into this on reboot, don't worry, you can usually just hit Enter to continue. 

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/16.jpg"
         alt="Error message, failed unmounting cdrom.mount. Just hit Enter!">
    <figcaption>Error message, failed unmounting cdrom.mount. Just hit Enter!</figcaption>
</figure>

To stop that error from appearing, you just need to unmount your ISO, or remove the virtual CD/DVD Drive. You can do this easily in PVE by heading to the Hardware tab, selecting it, and hitting Remove.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/17.jpg"
         alt="Showing the Hardware tab, highlighting the image mount CD/DVD Drive and the Remove button">
    <figcaption>Showing the Hardware tab, highlighting the image mount CD/DVD Drive and the Remove button</figcaption>
</figure>

You did it! Congratulations on your new Ubuntu Server VM.

<figure>
    <img src="/assets/2026-06-18/installing-ubuntu/18.jpg"
         alt="Showing a completed install of Ubuntu Server 24.04">
    <figcaption>Showing a completed install of Ubuntu Server 24.04</figcaption>
</figure>




