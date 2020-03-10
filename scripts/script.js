/*
Surfing ambient filter project
*/

// Loading SparkAR Modules and scene elements
import {s, 
    a, 
    d, 
    audio, 
    time, 
    r, 
    wave,
    backWave,
    sphere, 
    water_surface,
    sb_outside_emitter,
    sb_inside_emitter,
    sphere_model } from './config.js';

// Setting an initial value for the wave rotation position
wave.transform.rotationX = deg_to_rad(210);

// Function to convert Degrees into Radians
function deg_to_rad(i){
    return i*Math.PI/180;
}

// TODO: Effect concept and Environment Intro
// function effect_intro(){
//     const initialScreen_driver = a.timeDriver({durationMilliseconds:5000, loopCount:1, mirror:false});
// }

function wavecomming_anim(){
    d.log("wavecomming function call");
    backWave.hidden = true;

    //Audio effects
        // Paddel Sound
    let surferMovements_playbackController = audio.getPlaybackController("surferMovement_controller");
    surferMovements_playbackController.setPlaying(true);
    surferMovements_playbackController.setLooping(true);    
        // Heartbit Sound
    let heartBit_playbackController = audio.getPlaybackController('heartbit_controller');    
    heartBit_playbackController.setPlaying(true);
    heartBit_playbackController.setLooping(true);

    // Hidding Board Emitters
    sb_outside_emitter.hidden = true;
    sb_inside_emitter.hidden = true;

    // Time Drivers
    let wavecomming_driver = a.timeDriver({ durationMilliseconds:5000, loopCount:1, mirror: false });

    // Wave Position Samplers
    let wave_position_sampler_y = a.samplers.polybezier({ keyframes : [0.6, 0.11, -0.05, -0.02 ,-0.005, 0.05]});    
    let wave_position_sampler_z = a.samplers.polybezier({ keyframes : [-3.5, -3.15, -2.75 -2.1, -0.8, 0.15] });
    let wave_position_sampler_x = a.samplers.polybezier({ keyframes : [-2.9, 1.25, -0.1, -2.5, -3.15, -0.5]});
    // backWave Position Samplers    
    let backWave_position_sampler_z = a.samplers.polybezier({keyframes : [-1.9, -0.2, 0.1]});
    let backWave_position_sampler_x = a.samplers.polybezier({keyframes : [-2.9, 1.25, -0.1, -2.5, -3.15, -0.7]});
    let backWave_position_sampler_y = a.samplers.polybezier({ keyframes : [0.01, -0.05, -0.1, -0.5, -0.25, -0.01 , 0]});

    // Wave Scale Samplers
    let wave_sampler_scaleX = a.samplers.polybezier({ keyframes : [15, 10, 20, 25]});
    let wave_sampler_scaleY = a.samplers.polybezier({ keyframes : [6, 10, 8, 15, 12]});
    let wave_sampler_scaleZ = a.samplers.polybezier({ keyframes : [6, 10, 8, 15,12]});

    // Setting animations Wave Position Transform 
    wave.transform.y = a.animate(wavecomming_driver, wave_position_sampler_y);
    wave.transform.x = a.animate(wavecomming_driver, wave_position_sampler_x);
    wave.transform.z = a.animate(wavecomming_driver, wave_position_sampler_z);
    
    // Setting animations backWave Position Transform
    backWave.transform.x = a.animate(wavecomming_driver, backWave_position_sampler_x);
    backWave.transform.y = a.animate(wavecomming_driver, backWave_position_sampler_y);
    backWave.transform.z = a.animate(wavecomming_driver, backWave_position_sampler_z);

    // Setting animations Wave Scale Transform
    wave.transform.scaleX = a.animate(wavecomming_driver, wave_sampler_scaleX);
    wave.transform.scaleY = a.animate(wavecomming_driver, wave_sampler_scaleY);
    wave.transform.scaleZ = a.animate(wavecomming_driver, wave_sampler_scaleZ);
    
    // Triggering time driver animation
    wavecomming_driver.start();
    
    // At the driver ends
    wavecomming_driver.onCompleted().subscribe(() => {
        d.log("wavecomming driver animation ends");

        let surferMovements_playbackController = audio.getPlaybackController("surferMovement_controller");
        surferMovements_playbackController.setPlaying(false);
        surferMovements_playbackController.setLooping(false);

        //Next sequence function call
        takeOff_anim()

    });
}
////////////////////////////////////////////////////////////////
//              TakeOf function Sequence                     //
///////////////////////////////////////////////////////////////
function takeOff_anim(){
    d.log("takeOff function call");

    let water_plane = s.root.find("plano_agua");
    let occluder_plane = s.root.find("plano_occlusor");

    backWave.hidden = false;

    wave.hidden = true;
    sb_outside_emitter.hidden = false;
    sb_inside_emitter.hidden = false;
    
    backWave.transform.scaleZ = 0.7;
    backWave.transform.scaleX = 1;
    backWave.transform.scaleY = 0.05;
    backWave.transform.rotationX = deg_to_rad(-45);
    backWave.transform.rotationY = deg_to_rad(0);

    water_surface.transform.y = -3.5;
    sphere.transform.z = -7.5;
    sphere.transform.rotationY = deg_to_rad(0);

    // Drivers
    let sphere_driver = a.timeDriver({durationMilliseconds:500, loopCount:Infinity, mirror:true});
    let backWave_Zdriver = a.timeDriver({durationMilliseconds: 2500, loopCount:Infinity, mirror:true});
    let backWave_Ydriver = a.timeDriver({durationMilliseconds: 5000, loopCount:1, mirror:false});
    // Samplers
    let sphere_Ysamplers = a.samplers.linear(-4.0,-3.5);
    let to_wave_Zsamplers = a.samplers.linear(3, 2.0);
    let to_wave_Ysamplers = a.samplers.linear(1.05, 0);    
    // Animations
    sphere.transform.y = a.animate(sphere_driver, sphere_Ysamplers);
    backWave.transform.z = a.animate(backWave_Zdriver, to_wave_Zsamplers);
    backWave.transform.y = a.animate(backWave_Zdriver, to_wave_Ysamplers);

    backWave_Zdriver.start();
    // backWave_Ydriver.start();

    backWave_Zdriver.onAfterIteration().subscribe(() => {
        //Next sequence function call
        pipe_animation();
    });

    
} 

///////////////////////////////////////////////////////////////
//                 Pipe Sequence                            //
//////////////////////////////////////////////////////////////

function pipe_animation(){
    d.log("pipe_animation function call");
    wave.hidden = false;

    sphere_model.transform.scaleX = 12;
    sphere_model.transform.scaleY = 12;
    sphere_model.transform.scaleZ = 12;

    backWave.hidden = true;
    sphere.transform.rotationY = deg_to_rad(-90);

    //Audio
    let insideWave_playbackController = audio.getPlaybackController('insidewave_controller');    
    insideWave_playbackController.setPlaying(true);
    insideWave_playbackController.setLooping(true); 

    // Drivers
    let wave_driver = a.timeDriver({durationMilliseconds:3000, loopCount:1, mirror: true});
    let waveRotation_driver = a.timeDriver({ durationMilliseconds:900, loopCount:Infinity, mirror: false});
    let sphere_zPos_driver = a.timeDriver({durationMilliseconds:500, loopCount:Infinity, mirror: false});
    let wave_zPos_driver = a.timeDriver({durationMilliseconds: 9500, loopCount:Infinity, mirror: false});    

    // Position Samplers - Wave
    let wave_positionY_sample = a.samplers.polybezier(config: {keyframes : [0.15, 0, 0.2, 0.1, 0, 0.4]});
    let wave_positionX_sample = a.samplers.polybezier({keyframes : [-0.1, -0.25, -0.2, -0.1]});
    
    // Position Samplers - Sphere    
    let sphere_posY_samplers = a.samplers.polybezier({keyframes: [-0.8, -1.5, -2.7, -0.2, 0.7, 2.9, 1.1]});
    
    // Rotation Sampler - Wave
    let sampler_rotationX = a.samplers.polybezier({ keyframes : [deg_to_rad(300),deg_to_rad(360)]});
    let wave_rotationY_sample = a.samplers.polybezier({keyframes: [deg_to_rad(90), deg_to_rad(90)]});  
    
    // Rotation Sampler - Sphere
    let water_surface_zPos_samplers = a.samplers.polybezier({keyframes: [-5.5, -2.1, -0.5, 2, 2.8, 1.15]})
    let wave_zPos_samplers = a.samplers.polybezier({keyframes: [3.5, 2.5, 0.1, -0.5, -2, -3.8, 0.15]})

    // new wave position animation 
    wave.transform.y = a.animate(wave_driver, wave_positionY_sample);
    wave.transform.x = a.animate(wave_driver, wave_positionX_sample);
    wave.transform.z = a.animate(wave_zPos_driver, wave_zPos_samplers);
    
    // new sphere position animation
    sphere.transform.y = a.animate(wave_driver, sphere_posY_samplers);
    
    // water_surface z transition - velocity feeling 
    water_surface.transform.z = a.animate(sphere_zPos_driver, water_surface_zPos_samplers);

    // Setting new backWave Scales and hidding
    backWave.transform.scaleY = 0.25;
    // backWave.transform.x = 0.05;

    // Rotations
    wave.transform.rotationX = a.animate(waveRotation_driver, sampler_rotationX);
    wave.transform.rotationY = a.animate(wave_driver, wave_rotationY_sample);
    sphere.transform.rotationX = deg_to_rad(0);
    backWave.transform.rotationY = a.animate(wave_driver, wave_rotationY_sample);    

    // Triggering drivers
    wave_driver.start();
    sphere_zPos_driver.start();
    waveRotation_driver.start();

}

wavecomming_anim();

// Attributions
// Photo by Austin Schmid on Unsplash, Photo by Jeremy Bishop on Unsplash for the sphere