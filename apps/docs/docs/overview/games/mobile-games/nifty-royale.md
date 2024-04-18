---
id: nifty-royale
title: Nifty Royale
sidebar_position: 2
---

import ReactPlayer from 'react-player';
import VideoURL from '/video/nakedbeachflyby.mp4';

<div style={{ maxWidth: 450, margin: 'auto' }}>
  ![](/img/roadmap/niftyroyale_v01.webp)
</div>

## Theme

A battle royale third person shooter game in which players gather gems from the map's surface or explore underground to find gem caches. Every 20 seconds a player or players with the least gems will be removed. After 90 seconds, the battle royale circle will start shrinking. Each player that is out of the circle will lose one gem every second. The last player who survives wins

## Environment

Nifty Royale takes place in our Beach City & Naked Beach regions on [NiftyVerse](/docs/overview/games/niftyverse).

<div style={{ maxWidth: 640, marginRight: 'auto' }}>
  ![](/img/niftyverse/nakedbeach_01.webp)
</div>
<div style={{ maxWidth: 640, marginLeft: 'auto' }}>
  ![](/img/niftyverse/beachcity_01.webp)
</div>
<div style={{ maxWidth: 640, marginRight: 'auto' }}>
  ![](/img/niftyverse/beachcity_04.webp)
</div>

<ReactPlayer playing controls url={VideoURL} width="100%" />
<br />

**The Terrain**: The terrain consists of two area: “underground” and “surface”. The underground has different sections and each section has two holes which connect the underground to the surface. One hole for descending from the surface and the other for ascending to the surface (it pushes you up to the sky). The underground area is a randomly generated maze which is filled with toxic gas and players can’t stay there too long without losing their resistance bar. So, they should to go back to the surface frequently. On the surface players can use their hoverboard and jetpack to move quickly. There are much more gems in the underground than the surface so players have to go down to collect them. On the surface they usually pick up gem if other players drop them due to taking damage.

## Mechanics

**Movement**: Players can move freely in the environment.

**Shooting**: Players can shoot each other with different “Nerf guns” (each gun has a different damage).

**Hoverboard**: Players can use a hoverboard (with a cooldown) to travel faster on the map. The players cannot use their weapons while they are on the hoverboard.

**Jetpack**: Players can use jetpacks to get out of different situations (with a cooldown). The players can use their weapons while they are on the jetpack.

**Lootbox**: There will be boxes falling out of the sky every specific amount of time (shown on the map to players). Inside each box are a few gems and a gun. Players should break the boxes to reveal the content.

**Resistance bar**: Players have a resistance bar. Each time they take damage, their resistance bar decreased. Once the resistance bar gets emptied, the player gets stunned.

• The player who gets stunned will lose a large number of gems suddenly  
• The player who gets stunned cannot move for a certain number of seconds  
• The player who gets stunned is immune for a few seconds  
• The stunning resistance bar will get filled again slowly

## Details

The players spawn with only one handgun.

The players should try and gather gems from the map’s surface. They can find more by going underground.

You can also find better guns by going down the underground.

The guns and gems of the removed player will fall on the ground and other players can collect them. (The position of the removed player will be shown to other players for 10 seconds)

After 1.5 minutes, a circle will start shrinking.

Each player that is out of the circle will lose one gem every second.

You can also see player rank #1 on the map. This will avoid rank#1 camping too much and win the game easily.

**Optional**: At the middle of the game the toxic gas which was underground comes up to the surface and now players should go down to the underground area and continue the fight there.

## Skins

Players can change skins of their own character, weapons, hoverboard and Jetpack.

If a player picks up a weapon from a loot box, skin of the weapon changes automatically to what he set up previously in the game menu. However, once he drops it (like when he died) the skin will remain as was and won’t change even when other players pick it up.

## Buffs

There are a few buffs in the game which player can acquire them before entering the match Like increasing magazine capacity, reload speed and fire rate.

## Other Mods

**Team-Based game**: The game can also be played in teams. You gather gems for your team and if you lose a gem, your team's total number of gems will decrease.  
• The removal is done team by team.  
• The team with the most gems will win in the end.

**Capture the flag**: Each team has to try to pick up the enemy’s team flag and return it to the base.  
• You get one point for the team by each flag.  
• If you stun the player carrying the flag, he/she will drop the flag.  
• In the end, the team with the most points wins the game.

**Gathering balls**: There are lots of balls scattered on the map. Each team has to try to gather balls and take them to their base.  
• The map is smaller than other mods.  
• If you stun the player carrying the ball, he/she will drop the ball.  
• In the end, the team with the most balls will win the game.

## Game UI

The screen consists of two areas:

**Movement control area**: Whenever the player touches this area a joystick will appears on that point and the player can control movements.

**Camera control area**: When he touches this area and then moves his thumb, the camera will rotate. There are also two buttons in this area which will change based on player state.  
• Jump button: a single tap makes the player jump.  
• Swipe up on Jump button: activates the jetpack and then the jump button changes to a slider to control jetpack lift. More info on the second picture.  
• Swipe down on Jump button: activates the hoverboard and then the jump button changes to a cancel button. If the player presses the cancel button the hoverboard will be canceled.  
• Shoot button: to fire weapon. If the user keeps pressing the button, his weapon shoots continuously.  
• Swipe left or right on Shoot button: to switch between weapons

**Jetpack Lift Control**: As mentioned above whenever the player swipes up on the jump button, the jetpack activates and the jump button changes to a slider to control the jetpack lift. When he pushes up the slider the jetpack goes up and when he releases the slider the jetpack stops (and consequently he can shoot other players from height). The same goes for descending in addition when he touches the ground the jetpack deactivates and the slider button changes back to Jump button.

**Optional**: Whenever the player swipes up on the jump button, the jetpack activates and goes up to predetermined height and the jump button changes to a cancel button. When the player pushes the cancel button the jetpack goes down until it touches the ground and then deactivates.
