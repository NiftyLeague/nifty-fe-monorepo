---
id: nifty-smashers
title: Nifty Smashers
sidebar_position: 1
---

import ReactPlayer from 'react-player';
import VideoURL from '/video/lobby.mp4';

<div style={{ maxWidth: 500, margin: 'auto' }}>![](/img/logos/smashers/app_wordmark_logo_small.webp)</div>

Nifty Smashers is available on iOS, Android, and Steam with full cross-play support! Download the game at [niftysmashers.com](https://niftysmashers.com/)

# Game Overview

Enter the arena and fight against players from all around the world in this fun and casual online multiplayer game. Get in as many bat bonks on your friends as you can! Nifty Smashers takes inspiration from the classic Super Smash Bros game where the objective is to knock your opponents off the map to score points.

For some background, the local-multiplayer version of Nifty Smashers was made available in September 2021, followed by the online multiplayer. The desktop version of this game is now deprecated in favor of our free-2-play mobile game.

You can play using any other compatible controller (Playstation, Xbox, etc.) if you wish. For the deprecated desktop version you must have a [DEGEN NFT](/docs/overview/nfts/degens/about) to play. Simply connect your crypto wallet holding your DEGEN, enter the game lobby, and select your DEGEN for battle.

<ReactPlayer controls src="https://www.youtube.com/embed/4lnDrx4aDq8" width="100%" height={500} />

---

## Game Modes

### Brawl

- If a DEGEN is hit once and is knocked off the map you earn 1 point
- If a DEGEN is hit multiple times without being able to recover, you get points as often as the DEGEN is hit (regardless if previous hits were done by another DEGEN - so land the final mega-bonk to hit them off the map and claim all the points for the round)
- The more your opponent is successively bonked, the faster they bounce around and the more points you'll score for bonking
- The last hit that kills the DEGEN, gets all combo points
- a DEGEN can be hit ("combo’ed") up to 5 times before they explode, capping the number of points you can get (max 3 points in a 2-player match, and max 5 points in a 3- & 4-player match)
- A 2-player match require 7 pts to win a round
- 3- & 4-player matches require 10 pts to win a round
- If there is a tie after the 5th round, the tied players move into a sudden death round that the other players get to watch from the sideline

### Last DEGEN Standing Scoring

This game mode introduces a twist to our original brawl mode. Rounds are quick, last degen standing wins! Each round the winner recieves a point and the rounds continue until the first player achieves 3 points.

### 2v2

2v2 is a team mode following the standard Brawl rules. Team up with your friend or anyone online and compete to knock your opponents out. Strategize together to score those combos!

## Networking

### Lag Compensation

- The lag indicator shows the lag (ping speed) of your connection
- Lag typically indicates your ping speed is above 100ms
- Generally speaking, lag is always present whenever there is physical distance between the players on the internet (the greater the distance, the greater the lag)
- There are different techniques that developers use to compensate and hide the lag
- We have implemented a number of these lag compensation techniques that veil the lag for the best experience possible
- We have also incorporated solutions with servers all around the world so that we can match players closest to each other to minimize the lag as much as possible
- If you are interested in learning more about these techniques, check out [this post](https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html) we love on Lag Compensation by Gabriel Gambetta

### Custom Lobby

- A custom lobby can be used to open a match in a chosen region
- The creator of the lobby can see a code in the lobby map which can be shared with others
- If another DEGEN wants to join the lobby, they must first select the same region as the custom lobby, and then type the lobby code into the input box

### Changing Regions

- Nifty Smashers is a fast paced game where latency/ping is crucial
- The closer the chosen region is to the player’s location, the lower the ping
- After changing the region in the Web-GL or Desktop App, the current ping is displayed

## Battle Basics

General information, advice, tips and tricks regarding battling in Nifty Smashers.

### Controllers

- Playing with a controller is highly recommended (Playstation, Xbox, or any other controller)
- For a cheap solution checkout the Logitech F310 Gamepad

### Bat swings

- The bat can be swung in all possible directions: left, right, up, down, diagonals
- The bat can be swung by clicking the attack button
- Longer button presses makes the bat hit harder
- The bat can be swung while standing, running, or jumping
- Players may long press the attack button during jumps - this is usually a good way to surprise your opponent(s)

### Moving

- General moving directions are left and right
- Directions can be changed during jumps/tumble (this is much easier to accomplish using a controller)

### Jumping

- Jump height can be altered by press-duration of jump button
- Directions can be changed during jumps/tumble

### Flying Hamburger

- Catching the flying hamburger will make your DEGEN's bat hit much stronger - this typically results in a direct kill
- We are considering limiting burger buff duration by time and/or kill

## Tribe Specifics

Select from 6 different tribes, each with their own unique special move. Choose wisely to gain an advantage in battle.

All DEGEN tribes have a Special Ability (”SA”), which are consistent across all Nifty League games (live and future), including Nifty Smashers. Learn everything you need to know about each tribe [here](/docs/overview/nfts/degens/tribes).

## Progression

For an in-depth overview of the games progression system read our [Pregression Doc](https://docs.google.com/document/d/160WTUFqiL4oyap0x0Zf1rM9zxQGBCIGQbrWxF_604bM/edit?usp=sharing)

<ReactPlayer playing playsInline src={VideoURL} width="100%" height={500} />

---

🥊 Unlock New Items:
As you progress, unlock new weapons and bats to give you an edge over your opponents.

🥊 Upgrade Your Weapons:
Level up your weapons to make them more powerful and deadly in the arena.

🥊 Level Up your Character:
As you gain experience, level up your character and unlock new stats to become a true brawler.

🥊 Assign Stat Points:
Customize your character's attributes by assigning stat points to one of the several stat categories that the characters have. Choose wisely to suit your play-style.

🥊 Dress Up Your Character:
Show off your style and creativity by dressing up your character with cool cosmetic wearable items.

---

:::tip[Please join our [Discord](https://discord.gg/niftyleague)!]

We appreciate all feedback and need your ideas so we can improve the game and take it to the next level!

:::
