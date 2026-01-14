import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from '../../shaders/fragment';
import { vertexShader } from '../../shaders/vertex';
import './FlowerCanvas.css';

const FlowerCanvas = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const stateRef = useRef({
        pointer: { x: 0.66, y: 0.3, clicked: true, vanishCanvas: false },
        renderer: null,
        shaderMaterial: null,
        basicMaterial: null,
        sceneShader: null,
        sceneBasic: null,
        camera: null,
        clock: null,
        renderTargets: [],
        animationId: null,
    });

    useImperativeHandle(ref, () => ({
        clean: () => {
            stateRef.current.pointer.vanishCanvas = true;
            setTimeout(() => {
                stateRef.current.pointer.vanishCanvas = false;
            }, 50);
        },
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        const state = stateRef.current;

        // Initialize Three.js
        state.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        state.sceneShader = new THREE.Scene();
        state.sceneBasic = new THREE.Scene();
        state.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
        state.clock = new THREE.Clock();

        state.renderTargets = [
            new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
            new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
        ];

        // Create materials and planes
        state.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_stop_time: { type: 'f', value: 0 },
                u_stop_randomizer: {
                    type: 'v2',
                    value: new THREE.Vector2(Math.random(), Math.random()),
                },
                u_cursor: {
                    type: 'v2',
                    value: new THREE.Vector2(state.pointer.x, state.pointer.y),
                },
                u_ratio: { type: 'f', value: window.innerWidth / window.innerHeight },
                u_texture: { type: 't', value: null },
                u_clean: { type: 'f', value: 1 },
            },
            vertexShader,
            fragmentShader,
        });

        state.basicMaterial = new THREE.MeshBasicMaterial();
        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const planeBasic = new THREE.Mesh(planeGeometry, state.basicMaterial);
        const planeShader = new THREE.Mesh(planeGeometry, state.shaderMaterial);
        state.sceneBasic.add(planeBasic);
        state.sceneShader.add(planeShader);

        // Update size
        const updateSize = () => {
            state.shaderMaterial.uniforms.u_ratio.value =
                window.innerWidth / window.innerHeight;
            state.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        updateSize();

        // Render loop
        const render = () => {
            state.shaderMaterial.uniforms.u_clean.value = state.pointer.vanishCanvas
                ? 0
                : 1;
            state.shaderMaterial.uniforms.u_texture.value =
                state.renderTargets[0].texture;

            if (state.pointer.clicked) {
                state.shaderMaterial.uniforms.u_cursor.value = new THREE.Vector2(
                    state.pointer.x,
                    1 - state.pointer.y
                );
                state.shaderMaterial.uniforms.u_stop_randomizer.value =
                    new THREE.Vector2(Math.random(), Math.random());
                state.shaderMaterial.uniforms.u_stop_time.value = 0;
                state.pointer.clicked = false;
            }
            state.shaderMaterial.uniforms.u_stop_time.value += state.clock.getDelta();

            state.renderer.setRenderTarget(state.renderTargets[1]);
            state.renderer.render(state.sceneShader, state.camera);
            state.basicMaterial.map = state.renderTargets[1].texture;
            state.renderer.setRenderTarget(null);
            state.renderer.render(state.sceneBasic, state.camera);

            const tmp = state.renderTargets[0];
            state.renderTargets[0] = state.renderTargets[1];
            state.renderTargets[1] = tmp;

            state.animationId = requestAnimationFrame(render);
        };

        // Event handlers
        let isTouchScreen = false;

        const handleClick = (e) => {
            if (!isTouchScreen) {
                state.pointer.x = e.pageX / window.innerWidth;
                state.pointer.y = e.pageY / window.innerHeight;
                state.pointer.clicked = true;
            }
        };

        const handleTouchStart = (e) => {
            isTouchScreen = true;
            state.pointer.x = e.targetTouches[0].pageX / window.innerWidth;
            state.pointer.y = e.targetTouches[0].pageY / window.innerHeight;
            state.pointer.clicked = true;
        };

        const handleResize = () => {
            updateSize();
            state.pointer.vanishCanvas = true;
            setTimeout(() => {
                state.pointer.vanishCanvas = false;
            }, 50);
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('resize', handleResize);

        // Initial flower after delay
        const initialTimeout = setTimeout(() => {
            state.pointer.x = 0.75;
            state.pointer.y = 0.5;
            state.pointer.clicked = true;
        }, 700);

        render();

        // Cleanup
        return () => {
            clearTimeout(initialTimeout);
            cancelAnimationFrame(state.animationId);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('resize', handleResize);
            state.renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} id="canvas" />;
});

FlowerCanvas.displayName = 'FlowerCanvas';

export default FlowerCanvas;
