---
layout: post
title:  "Discord (and more) to monitor server uptime?"
description: "Uptime Kuma can be used to monitor if your servers are alive using Discord, Teams, and just about anything else!"
keywords: "proxmox, virtual environment, pve, virtual machine, ubuntu server, how to, tutorial, tech, it, docker, configuration, uptime, server status, uptime kuma"
subtitle: "Uptime Kuma"
date:   2026-08-05 10:00:00 +0100
category: homelab
author: "Jamie"
permalink: "/blog/discord-uptime-kuma"
---

Another addition to the Home Lab! We're talking about Uptime Kuma today. Uptime Kuma is a fun and simple new addition to my Home Lab. If you've got Docker, you'll be ready to configure in a few minutes. I use Discord a lot for keeping me in the loop for whatever my latest obsession is and I wondered if I could do the same for my Home Lab. 

Notifications can be annoying, or super helpful, depending on how you want to configure them. I don't keep my Home Lab running constantly, just fire it up for testing in my own separate environment, but maybe one day that will change and I wanted to set this up in preparation for that potential. 

To catch up to my solution, if you want to follow along directly, I'm using Proxmox Virtual Environment and an Ubuntu Server 26.04 Virtual Machine. I have a guide for setting up an Ubuntu VM (<a href="/blog/creating-a-vm-in-proxmox-ve" target="_blank">Creating a VM in Proxmox VE</a>) if you need a bit of assistance to get to that point. These aren't hard requirements, feel free to check out the <a href="https://github.com/louislam/uptime-kuma" target="_blank">Uptime Kuma GitHub page</a> for further information. I'd also recommend taking a look at the <a href="https://docs.docker.com/engine/install/ubuntu/" target="_blank">Docker setup</a> for their setup guide if needed.


For my VM (which I plan to host multiple Docker containers but is just this as the moment), and it's running as smooth as butter, I've got the following specs:
CPU - 1 socket, 2 cores
RAM - 4GB, no ballooing/dynamic RAM
Disk - 64GB

Running this and getting alerts, I'm only using around 3-5% of my CPU, 1.5GB of RAM and 10GB of my disk. Headroom for another container, plenty if I expand my RAM on here.
<figure>
    <img src="/assets/2026-08-05/1.jpg"
         alt="State of my Docker Ubuntu server running Uptime Kuma">
    <figcaption>State of my Docker Ubuntu server running Uptime Kuma</figcaption>
</figure>

Here's an example of the alerts I've currently got set up. Don't mind the red, as always with anything like this, test it works. Powering off those reds gave me alerts as I expected and it's good to see it's working. I'll show that off a bit more later.
<figure>
    <img src="/assets/2026-08-05/2.jpg"
         alt="My current alert setup after some use">
    <figcaption>My current alert setup after some use</figcaption>
</figure>

Kuma's install itself, run these commands one after another:
<pre><code>mkdir uptime-kuma</code></pre>
<pre><code>cd uptime-kuma</code></pre>
<pre><code>curl -o compose.yaml https://raw.githubusercontent.com/louislam/uptime-kuma/master/compose.yaml</code></pre>
<pre><code>docker compose up -d</code></pre>

After a brief install process, head to your VM's IP address in your favourite browser, tagging on port 3001. If you're not sure, just run ipconfig on Windows or ip addr on Linux distros.
<pre><code>192.168.20.11:3001</code></pre>

You'll be greeted with the page for creating an admin account, punch in some details and hit Create. If you've already jumped that step, log in with your creds instead.
<figure>
    <img src="/assets/2026-08-05/3.jpg"
         alt="Uptime Kuma registration process from their GUI">
    <figcaption>Uptime Kuma registration process from their GUI</figcaption>
</figure>

Let's start with adding a Monitor, at a basic level these are just something you want to track. If, like me, you have a High Availability set up on your Lab, a good start for this would be "is my server alive". Naturally, if the server is running this Uptime Kuma container, Kuma won't be alive to even tell you that. Since I have failover, if my Proxmox node hosting my Docker server drops out, it can failover to another node and still send out alerts. If you're running a single server setup, this will be better for tracking *other* services you may be running such as Domain Controllers, Web Servers, all the fun stuff. 

Click Add New Monitor and let's get going.

<figure>
    <img src="/assets/2026-08-05/4.jpg"
         alt="Add our first Monitor to Kuma!">
    <figcaption>Add our first Monitor to Kuma!</figcaption>
</figure>


Under Monitor Type, you get a ton of options. I'll set up for one of my Proxmox nodes (I know I already have one but... science!). I picked TPC Port so I can check if the web GUI is available on my node. Plenty of other options, maybe even a better one for this, but if I can get to my IP:Port on my node, I should be good to go. If I can't, it'll let me know. 

Friendly name, pick something you know the server as, likely the DNS name you set for it. Hostname and Port will be the IP address and Port, in my case 192.168.0.201 and 8006. 

I don't have an SSL certificate set up for these, so I'll pick None for SSL/TLS and we can also ignore the Expected TLS Alert in this case.

Heartbeat will be how often Kuma tries to get at the service. 60 seconds is default and also works quite nicely. Retries just means how many times it will try that Heartbeat and fail before it's considered "down". I like 0, this will also help spot any blips or micro-downtimes.

Resend Notification will be what you're wanting to configure for any alerts or this will get spammy. When you're at panic stations, who needs a repetitive notification, I set mine to 5. Just a game of math here, if you're checking every 60 seconds but only want an alert every 5 attempts, that's a 5 minute interval before another notification comes through. Mileage varies depending on yourself here, go wild with those settings.

There's a few other options, and that's up to you. Upside Down Mode (reversing what's considered "down" or "up"), I haven't found a use for but I'm sure with some creative thinking this may be useful. Monitor Group is great, you can put everything into a group, for example I have all my nodes in a group called Proxmox Nodes, and you can apply a single set of the above rules to a group instead of to all the individuals. Tags are also there if you have any use for those.

<figure>
    <img src="/assets/2026-08-05/5.jpg"
         alt="Here we can see all the fun settings we can change.. there's lots!">
    <figcaption>Here we can see all the fun settings we can change.. there's lots!</figcaption>
</figure>

Go ahead and press Save. You should see your first monitor now available on the home page. If you give it a click, you can see the specifics for that Monitor. If you created a Monitor Group, it'll be nested in the group, and the group will show the uptime of all things within it as a cumulative.

<figure>
    <img src="/assets/2026-08-05/6.jpg"
         alt="Example of a saved Monitor and stats available">
    <figcaption>Example of a saved Monitor and stats available</figcaption>
</figure>

A handy button here is Clone. If, like myself, you have some additional nodes, you can go ahead and just punch in that IP and hit Save to create another one super quick. 

The keen-eyed among you may have already spotted the Set Up Notification button when creating a Monitor. You can also get to this by heading to the top-right of the GUI, clicking your account, and going to Settings. Under the Notifications tab, you can set up a notification and modify some of the in-Kuma Toast notifications if you want to swap those out too. There's more to play with too if you like personalising. Let's set up a notification, for my case, using Discord.

<figure>
    <img src="/assets/2026-08-05/7.jpg"
         alt="Getting to the Notification Settings menu">
    <figcaption>Getting to the Notification Settings menu</figcaption>
</figure>

Under Notification Type, you'll see there's a choice for just about any messaging you could hope for. Massive selection that should accommodate any of your needs. Give it a Friendly Name so you know what you're working with. 

<figure>
    <img src="/assets/2026-08-05/8.jpg"
         alt="Setting up a Discord notification">
    <figcaption>Setting up a Discord notification</figcaption>
</figure>

You're going to need a Discord Server if you haven't one already. They're free to set up and very simple. If you need some assistance, <a href="https://discord.com/blog/starting-your-first-discord-server" target="_blank">Discord have their own guide</a> on setting one up. No need to set up perfectly when you have one, this is your playground, I'd just suggest creating a new text channel for your alerts, and right-clicking your server icon and setting notifications to "only @metions" ready for later.
<figure>
    <img src="/assets/2026-08-05/9.jpg"
         alt="Set Discord server notifications to only @mentions!">
    <figcaption>Set Discord server notifications to only @mentions!</figcaption>
</figure>

Once you have yourself a dedicated chat channel for Kuma, head to the server name up top, click the drop-down and go to Server Settings.
<figure>
    <img src="/assets/2026-08-05/10.jpg"
         alt="Getting to Discord Server Settings">
    <figcaption>Getting to Discord Server Settings</figcaption>
</figure>

On the left menu, click on Integrations, then Webhooks.
<figure>
    <img src="/assets/2026-08-05/11.jpg"
         alt="Discord's Integrations > Webhooks">
    <figcaption>Discord's Integrations > Webhooks</figcaption>
</figure>

Create a new Webhook, name it something recognizable, and pick your dedicated text channel from the dropdown. Make sure you hit Save at this point to make sure those settings are in place.
<figure>
    <img src="/assets/2026-08-05/12.jpg"
         alt="Create your Webhook and hit Save!">
    <figcaption>Create your Webhook and hit Save!</figcaption>
</figure>

Now you've got your Web Hook ready to go, hit that Copy Webhook URL button ready to paste into Kuma.
<figure>
    <img src="/assets/2026-08-05/13.jpg"
         alt="Getting your Webhook URL ready for Kuma">
    <figcaption>Getting your Webhook URL ready for Kuma</figcaption>
</figure>

In our Notification setup, making sure we've got Discord set as the Notification Type and we've got a nice Friendly Name, paste your Webhook URL into the box. 

The bot's display name, I just matched what was provided when setting up our Webhook. Tag an @everyone on there for a prefix and we're golden with the defaults.
<figure>
    <img src="/assets/2026-08-05/14.jpg"
         alt="Settings to prepare our Discord notifications">
    <figcaption>Settings to prepare our Discord notifications</figcaption>
</figure>

At the bottom, slightly outside of print on the above image, there's a handy little Test button. Let's make sure it works and hit that button! Make sure you hit Save once you know it's working.
<figure>
    <img src="/assets/2026-08-05/15.jpg"
         alt="Show off the Test button for Discord notifications">
</figure>
<figure>
    <img src="/assets/2026-08-05/16.jpg"
         alt="My testing Discord alert coming through to the text channel">
    <figcaption>And here it is, our first working alert!</figcaption>
</figure>

Now you know it works, click into your Monitor and hit the Edit button. In the top-right, you'll see some sliders for the notifications you've set up, slide that Notification's radio button to the right and Save your work!
<figure>
    <img src="/assets/2026-08-05/17.jpg"
         alt="Notification radio buttons, turn it on!">
    <figcaption>Notification radio buttons, turn it on!</figcaption>
</figure>

It's time to test. We're going nuclear, power off the thing you're tracking and you should get an alert within 60 seconds (or whatever you set your Heartbeat to!). If you've used a Monitor Group like I have, you'll see that the "Group" has gone down, with the Error category showing which "Child monitor" has taken a dive.

Similarly, when it comes back up, it'll say the group is back up!

<figure>
    <img src="/assets/2026-08-05/18.jpg"
         alt="Alerts received for both going offline and coming back online">
    <figcaption>Alerts received for both going offline and coming back online</figcaption>
</figure>

A cool one I set up, again potentially not in the best way, is a "Still Alive" alert. Extracurricular, let's go. This is helpful just to know that Kuma itself is still able to send alerts. I don't have this triggering @everyone (don't add @everyone in the Prefix Custom Message, just add something like "I'm here!") by just having this set up as a different notification, so it's just a standard message coming through in the background that I may or may not check, but a good to have. For this setup I've got it pinging a random IP I know is not on my network. It constantly triggers as red/offline but to manage those alerts not being spammy, I set to a 60s Heartbeat, 0 Retries, and a Resend Notification of 30. This means once every 30 minutes I'll have Kuma checking in to say "I'm still here!". Super helpful.
<figure>
    <img src="/assets/2026-08-05/19.jpg"
         alt="Custom alert, Discord notification saying Still Alive!">
</figure>
<figure>
    <img src="/assets/2026-08-05/20.jpg"
         alt="Uptime Kuma settings for setting up the Still Alive!' alert">
    <figcaption>Here are my settings for making the Still Alive! function</figcaption>
</figure>

Have fun setting up alerts as you like, and remember, test them. Power off your device, if you get an alert, you're golden. Although a Ping is easy to set up to see if you can reach it, keep in mind that this may be a red herring for it being alive. The network card may be able to receive the ping and the service it's providing not being alive. Thanks for following along!

Jamie