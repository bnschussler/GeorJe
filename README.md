# Schrodinger Equation Simulation
Simulation of a quantum particle in 1(+1) dimensions

This program is designed with computers in mind. If you're on a mobile device, it might be harder to use.

<h2>What is this?</h2>
<p>This program simulates a particle (like an electron) moving according to the laws of Quantum Mechanics (specifically the Schrödinger Equation). In this setup, a particle living in one dimension (two if you count time) moves in a "potential field", shown in purple. The potential field is like the terrain the particle moves through — a high potential is like a hill, and low is like a valley. The particle may not be able to go over a high increase in the potential, or lose momentum in the process, and can gain momentum by moving from high to low potential. 
<p>In QM, the particle doesn't have a definite position and momentum — only a wave function. The position space representation of the particle (where it is) is shown on the top half, and the momentum space (how fast it is) on the bottom. The wave function is a complex number field, so the real component is represented by red, and the imaginary component in blue. The green is the probability density, or how likely it would be to find the particle at that point. You can click on the wave function (either position or momentum) to "measure" it, which simulates wave function collapse.
<p>Preset 1's settings demonstrate quantum tunneling (a small amonut of the probability gets past the wall), and Preset 2 simulates a particle trapped in a potential well, but there is plenty of room to mess around with the setup! You can change the position, momentum, and uncertainty of the particle (each of which affect the position and momentum spaces differently), toggle the checkboxes to put the particle in a superposition of multiple states/mix and match the potential fields, measure the particle, and speed up or even reverse time. Have fun!</p>
<p>This is a project I originally made in Processing, and recently transcribed to JavaScript.</p> 
<p>go to https://bnschussler.github.io/GeorJe/ to try it out! (yes the repository name is "GeorJe")</p>
