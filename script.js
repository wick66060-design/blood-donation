document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Dark/Light Mode)
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    const icon = themeBtn.querySelector('i');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    applyTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 2. Mobile Hamburger Menu
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');

        if (navMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // 3. Highlight Active Link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage) {
            link.classList.add('active-link');
        }
    });

    // 4. Fade-in on Scroll (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // Dynamic Header & Scroll Progress
    const navbar = document.querySelector('.navbar');
    let scrollProgressBar = document.createElement('div');
    scrollProgressBar.classList.add('scroll-progress');
    document.body.appendChild(scrollProgressBar);

    window.addEventListener('scroll', () => {
        // Header shrink
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgressBar.style.width = scrolled + '%';

        // Manual Parallax logic for any matching elements
        const parallaxes = document.querySelectorAll('.parallax-element');
        parallaxes.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.5;
            const yPos = -(window.scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Initial check for header
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // 5. Accordion Logic (Myths vs Facts & FAQs)
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const body = acc.nextElementSibling;
            const icon = acc.querySelector('i');
            const isOpen = body.classList.contains('open');

            // Close all others
            document.querySelectorAll('.accordion-body').forEach(b => {
                b.style.maxHeight = null;
                b.classList.remove('open');
            });
            document.querySelectorAll('.accordion-header i').forEach(i => {
                i.classList.replace('fa-chevron-up', 'fa-chevron-down');
            });

            // If it wasn't open, open it
            if (!isOpen) {
                body.style.maxHeight = body.scrollHeight + "px";
                body.classList.add('open');
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    });

    // 6. Form Submission Validation (Get Involved)
    const involvedForm = document.getElementById('get-involved-form');
    if (involvedForm) {
        involvedForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            if (name && email) {
                // Simulate success modal/alert
                alert(`Thank you, ${name}! Your registration as a voluntary donor has been received. The National Blood Bank will contact you soon.`);
                involvedForm.reset();
            }
        });
    }

    // 7. Chart.js Initialization (why-donate.html)
    const ctx = document.getElementById('donationChart');
    if (ctx) {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Voluntary Donors (26%)', 'Replacement Donors (74%)'],
                datasets: [{
                    data: [26, 74],
                    backgroundColor: [
                        '#10b981', // Accent green
                        '#c91c1c'  // Primary red
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDarkMode ? '#f3f4f6' : '#222',
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }

    // 8. Three.js Background Animation (index.html)
    function initThreeJS() {
        const canvasContainer = document.getElementById('hero-3d-canvas');
        if (!canvasContainer || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });

        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // Realistic Red Blood Cell Geometry (Biconcave shape)
        // Outer ring
        const torusGeo = new THREE.TorusGeometry(0.8, 0.4, 16, 32);
        // Inner web (squashed cylinder to fill the hole with a dip)
        const cylinderGeo = new THREE.CylinderGeometry(0.81, 0.81, 0.3, 32);

        // Merge geometries for performance (using a single object per cell)
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const cellColor = isDarkMode ? 0xff4444 : 0xc91c1c;

        const material = new THREE.MeshStandardMaterial({
            color: cellColor,
            roughness: 0.3, // Slightly rougher so it doesn't look like glass
            metalness: 0.05,
            side: THREE.DoubleSide
        });

        const cells = [];

        // Add 40 realistic red blood cells
        for (let i = 0; i < 40; i++) {
            const cellGroup = new THREE.Group();

            const ring = new THREE.Mesh(torusGeo, material);
            ring.rotation.x = Math.PI / 2; // flatten torus
            cellGroup.add(ring);

            const center = new THREE.Mesh(cylinderGeo, material);
            // Squish the center to create the biconcave 'dip'
            center.scale.set(1, 0.5, 1);
            cellGroup.add(center);

            // Random positions within a volume
            cellGroup.position.x = (Math.random() - 0.5) * 40;
            cellGroup.position.y = (Math.random() - 0.5) * 30;
            cellGroup.position.z = (Math.random() - 0.5) * 20 - 5;

            // Scale to normal size
            const scale = Math.random() * 0.4 + 0.3; // smaller baseline scale
            cellGroup.scale.set(scale, scale, scale);

            // Random initial rotation
            cellGroup.rotation.x = Math.random() * Math.PI;
            cellGroup.rotation.y = Math.random() * Math.PI;

            // Custom speeds for organic movement
            cellGroup.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.03,
                rotSpeedY: (Math.random() - 0.5) * 0.03,
                moveSpeedY: (Math.random() - 0.5) * 0.06
            };

            cells.push(cellGroup);
            group.add(cellGroup);
        }

        // White Blood Cell Geometry (Organic bumpy sphere)
        const wbcGeo = new THREE.IcosahedronGeometry(0.8, 3);
        const posAttribute = wbcGeo.attributes.position;
        // Randomly displace vertices to create ruffled/bumpy surface characteristic of leukocytes
        for (let i = 0; i < posAttribute.count; i++) {
            const v = new THREE.Vector3().fromBufferAttribute(posAttribute, i);
            v.normalize().multiplyScalar(0.8 + Math.random() * 0.15);
            posAttribute.setXYZ(i, v.x, v.y, v.z);
        }
        wbcGeo.computeVertexNormals();

        const wbcMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc, // off-white color
            roughness: 0.8,
            metalness: 0.05
        });

        // Add 10 White Blood Cells
        for (let i = 0; i < 10; i++) {
            const wbc = new THREE.Mesh(wbcGeo, wbcMat);
            wbc.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 5);
            const scale = Math.random() * 0.3 + 0.5; // Slightly larger than RBCs
            wbc.scale.setScalar(scale);
            wbc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            wbc.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.015,
                rotSpeedY: (Math.random() - 0.5) * 0.015,
                moveSpeedY: (Math.random() - 0.5) * 0.02 // Slower movement
            };
            cells.push(wbc);
            group.add(wbc);
        }

        // Platelet Geometry (Small biconvex smooth discs - inactive state)
        const platGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const platMat = new THREE.MeshStandardMaterial({
            color: 0xfdf6b2, // pale yellow
            roughness: 0.5,
            metalness: 0.1
        });

        // Add 30 Platelets
        for (let i = 0; i < 30; i++) {
            const plat = new THREE.Mesh(platGeo, platMat);
            plat.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 5);
            const scale = Math.random() * 0.2 + 0.3; // Small
            plat.scale.set(scale, scale * 0.4, scale); // Squashed sphere (pancake/lentil shape)
            plat.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            plat.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.06,
                rotSpeedY: (Math.random() - 0.5) * 0.06,
                moveSpeedY: (Math.random() - 0.5) * 0.08 // Faster movement
            };
            cells.push(plat);
            group.add(plat);
        }

        // Add soft, realistic lighting for skin/cells
        const ambientLight = new THREE.AmbientLight(0xffaaaa, 0.6); // slight red tint
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
        rimLight.position.set(-5, -5, -5);
        scene.add(rimLight);

        camera.position.z = 15;

        // Mouse Parallax logic
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            // Normalize mouse coordinates (-1 to 1)
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = function () {
            requestAnimationFrame(animate);

            // Animate each cell
            group.children.forEach(cell => {
                cell.rotation.x += cell.userData.rotSpeedX;
                cell.rotation.y += cell.userData.rotSpeedY;

                // Float upwards or downwards continuously
                cell.position.y += cell.userData.moveSpeedY;
                if (cell.position.y > 15) cell.position.y = -15;
                if (cell.position.y < -15) cell.position.y = 15;
            });

            // Gentle parallax rotation effect on the whole group based on mouse
            group.rotation.x += (mouseY * 0.3 - group.rotation.x) * 0.05;
            group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            if (!canvasContainer) return;
            const width = canvasContainer.clientWidth;
            const height = canvasContainer.clientHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        // Listen for theme changes to update cell colors
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                // Wait briefly for the DOM attribute to update
                setTimeout(() => {
                    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
                    material.color.setHex(dark ? 0xff4444 : 0xc91c1c);
                }, 50);
            });
        }
    }

    initThreeJS();

    // 9. 3D Characters for How-To-Donate steps
    function initHowToDonate3D() {
        const canvases = [
            document.getElementById('step1-canvas'),
            document.getElementById('step2-canvas'),
            document.getElementById('step3-canvas'),
            document.getElementById('step4-canvas'),
            document.getElementById('step5-canvas')
        ];

        // Ensure we only run this on the how to donate page
        if (!canvases[0] || typeof THREE === 'undefined') return;

        canvases.forEach((canvasDiv, index) => {
            if (!canvasDiv) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, canvasDiv.clientWidth / canvasDiv.clientHeight, 0.1, 100);
            camera.position.z = 6;
            camera.position.y = 1;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            canvasDiv.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
            dirLight.position.set(2, 5, 3);
            scene.add(dirLight);

            // Construct Character
            const character = new THREE.Group();

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const bodyColor = isDark ? 0x9ca3af : 0xe0e0e0;
            const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5 });
            const primaryMat = new THREE.MeshStandardMaterial({ color: 0xc91c1c, roughness: 0.5 }); // Red shirt
            const accentMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 }); // Green shirt

            // Head
            const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
            const head = new THREE.Mesh(headGeo, bodyMat);
            head.position.y = 2;
            character.add(head);

            // Eyes
            const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
            const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
            leftEye.position.set(-0.15, 2.1, 0.45);
            const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
            rightEye.position.set(0.15, 2.1, 0.45);
            character.add(leftEye, rightEye);

            // Torso
            const torsoGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.5, 32);
            const torso = new THREE.Mesh(torsoGeo, primaryMat);
            torso.position.y = 0.75;
            character.add(torso);

            // Arms (Pivoting at shoulder)
            const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
            armGeo.translate(0, -0.6, 0); // Origin at top (shoulder)

            const leftArm = new THREE.Mesh(armGeo, bodyMat);
            leftArm.position.set(-0.7, 1.4, 0);
            const rightArm = new THREE.Mesh(armGeo, bodyMat);
            rightArm.position.set(0.7, 1.4, 0);

            character.add(leftArm, rightArm);

            // Legs (Pivoting at hip)
            const legGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.5, 16);
            legGeo.translate(0, -0.75, 0);
            const leftLeg = new THREE.Mesh(legGeo, bodyMat);
            leftLeg.position.set(-0.25, 0, 0);
            const rightLeg = new THREE.Mesh(legGeo, bodyMat);
            rightLeg.position.set(0.25, 0, 0);

            character.add(leftLeg, rightLeg);

            // Adjust position
            character.position.y = -1;
            scene.add(character);

            let time = 0;

            // Specific Step Setup
            if (index === 0) { // Step 1: Eligibility (Clipboard)
                const boardGeo = new THREE.BoxGeometry(0.8, 1, 0.05);
                const boardMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // brown
                const board = new THREE.Mesh(boardGeo, boardMat);
                board.position.set(0, 0.5, 0.6);
                board.rotation.x = -Math.PI / 4;
                character.add(board);

                leftArm.rotation.x = -Math.PI / 2;
                rightArm.rotation.x = -Math.PI / 2;
                leftArm.rotation.z = Math.PI / 4;
                rightArm.rotation.z = -Math.PI / 4;

            } else if (index === 1) { // Step 2: Register (Writing)
                leftArm.rotation.x = -Math.PI / 2.2;
                leftArm.rotation.z = Math.PI / 6;

            } else if (index === 2) { // Step 3: Screening (Heart Pulse)
                const heartGeo = new THREE.SphereGeometry(0.3, 16, 16);
                heartGeo.scale(1, 1, 0.5); // flatten
                const heart = new THREE.Mesh(heartGeo, primaryMat);
                heart.position.set(0, 1.2, 0.6);
                character.add(heart);
                character.userData.heart = heart;

            } else if (index === 3) { // Step 4: Donate 
                leftArm.rotation.z = Math.PI / 3; // arm out

                const dropGeo = new THREE.SphereGeometry(0.1, 16, 16);
                const dropMat = new THREE.MeshStandardMaterial({ color: 0xc91c1c });
                const drop = new THREE.Mesh(dropGeo, dropMat);
                leftArm.add(drop); // parent to arm
                character.userData.drop = drop;

            } else if (index === 4) { // Step 5: Recover (Sitting and eating)
                leftLeg.rotation.x = -Math.PI / 2;
                rightLeg.rotation.x = -Math.PI / 2;
                character.position.y = -0.5; // lower down
                torso.material = accentMat; // Green shirt

                const cookieGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
                cookieGeo.rotateX(Math.PI / 2);
                const cookieMat = new THREE.MeshStandardMaterial({ color: 0xd2691e }); // orange/brown
                const cookie = new THREE.Mesh(cookieGeo, cookieMat);
                cookie.position.set(0, -1.2, 0); // attach to hand
                rightArm.add(cookie);
                character.userData.cookie = cookie;
            }

            // Animation Loop
            const animate = function () {
                requestAnimationFrame(animate);
                time += 0.05;

                // Subtle breathing and bouncing for all (except sitting)
                if (index !== 4) {
                    torso.scale.x = 1 + Math.sin(time) * 0.02;
                    torso.scale.z = 1 + Math.sin(time) * 0.02;
                    head.position.y = 2 + Math.sin(time) * 0.05;
                }

                if (index === 0) {
                    // Nodding
                    head.rotation.x = Math.sin(time * 2) * 0.15 + 0.15;
                } else if (index === 1) {
                    // Right arm rapid writing
                    rightArm.rotation.x = -Math.PI / 2 + Math.sin(time * 5) * 0.1;
                    rightArm.rotation.z = Math.sin(time * 3) * 0.1;
                } else if (index === 2) {
                    // Beating heart
                    if (character.userData.heart) {
                        const s = 1 + Math.abs(Math.sin(time * 4)) * 0.25;
                        character.userData.heart.scale.set(s, s, s * 0.5);
                    }
                } else if (index === 3) {
                    // Blood drop falling logic
                    if (character.userData.drop) {
                        const progress = (time * 1.5) % 2; // loops 0 to 2
                        character.userData.drop.position.set(0, -1.2 - progress, 0); // falls down from hand
                        character.userData.drop.scale.setScalar(1 - progress * 0.4); // shrinks slightly as it falls
                    }
                } else if (index === 4) {
                    // Eating motion
                    const cycle = Math.sin(time * 2);
                    rightArm.rotation.x = -Math.PI / 2 * Math.max(0, cycle);
                    rightArm.rotation.z = Math.PI / 4 * Math.max(0, cycle);
                }

                // Smooth hover rotation on Y axis
                character.rotation.y = Math.sin(time * 0.2) * 0.2;

                renderer.render(scene, camera);
            };

            animate();

            // Resize handling
            window.addEventListener('resize', () => {
                if (!canvasDiv) return;
                const w = canvasDiv.clientWidth;
                const h = canvasDiv.clientHeight;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            });

            // Dynamic theme handling
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
                        bodyMat.color.setHex(dark ? 0x9ca3af : 0xe0e0e0);
                    }, 50);
                });
            }
        });
    }

    initThreeJS();

    // 9. 3D Real-Person Characters for How-To-Donate steps
    function initHowToDonate3D() {
        const canvases = [
            document.getElementById('step1-canvas'),
            document.getElementById('step2-canvas'),
            document.getElementById('step3-canvas'),
            document.getElementById('step4-canvas'),
            document.getElementById('step5-canvas')
        ];

        if (!canvases[0] || typeof THREE === 'undefined') return;

        // Realistic low-poly humanoid constructor
        function createHuman(skinTone, shirtColor, pantsColor) {
            const person = new THREE.Group();

            const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.3, metalness: 0.1 });
            const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6, metalness: 0.05 });
            const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });
            const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
            const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.2 });

            // Torso (Spine)
            const torsoGroup = new THREE.Group();
            torsoGroup.position.set(0, 0.8, 0); // slightly lower for cuter proportions
            person.add(torsoGroup);

            // Using Cylinders for softer rounded bodies
            const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.2, 32), pantsMat);
            pelvis.position.set(0, -0.1, 0);
            torsoGroup.add(pelvis);

            const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.25, 32), shirtMat);
            abdomen.position.set(0, 0.125, 0);
            torsoGroup.add(abdomen);

            const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.35, 32), shirtMat);
            chest.position.set(0, 0.425, 0);
            torsoGroup.add(chest);

            // Neck & Head
            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.1), skinMat);
            neck.position.set(0, 0.65, 0);
            torsoGroup.add(neck);

            const headPivot = new THREE.Group();
            headPivot.position.set(0, 0.7, 0);
            torsoGroup.add(headPivot);

            // Samsung/AR Emoji style big head
            const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), skinMat);
            headSphere.position.set(0, 0.22, 0);
            headSphere.scale.set(1, 1.05, 1); // Slightly oval
            headPivot.add(headSphere);

            // Stylized Hair
            const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8), hairMat);
            hair.position.set(0, 0.24, 0);
            headPivot.add(hair);

            // Cute Expressive Eyes
            const scleraGeo = new THREE.SphereGeometry(0.04, 16, 16);
            const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
            const pupilGeo = new THREE.SphereGeometry(0.02, 16, 16);
            const pupilMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });

            const lEyeGroup = new THREE.Group();
            lEyeGroup.position.set(-0.07, 0.25, 0.19);
            lEyeGroup.add(new THREE.Mesh(scleraGeo, scleraMat));
            const lPupil = new THREE.Mesh(pupilGeo, pupilMat);
            lPupil.position.set(0, 0, 0.03);
            lEyeGroup.add(lPupil);

            const rEyeGroup = new THREE.Group();
            rEyeGroup.position.set(0.07, 0.25, 0.19);
            rEyeGroup.add(new THREE.Mesh(scleraGeo, scleraMat));
            const rPupil = new THREE.Mesh(pupilGeo, pupilMat);
            rPupil.position.set(0, 0, 0.03);
            rEyeGroup.add(rPupil);

            headPivot.add(lEyeGroup, rEyeGroup);

            // Friendly Smile
            const smileGeo = new THREE.TorusGeometry(0.03, 0.006, 8, 16, Math.PI);
            const smileMat = new THREE.MeshBasicMaterial({ color: 0x331111 });
            const smile = new THREE.Mesh(smileGeo, smileMat);
            smile.position.set(0, 0.15, 0.21);
            smile.rotation.x = Math.PI; // Flip to smile
            headPivot.add(smile);

            // Arms
            function createArm(isRight) {
                const sign = isRight ? 1 : -1;
                const shoulderPivot = new THREE.Group();
                // Adjusted width to match narrower cylinder chest
                shoulderPivot.position.set(sign * 0.24, 0.52, 0);
                torsoGroup.add(shoulderPivot);

                const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.16, 16), shirtMat);
                sleeve.position.set(0, -0.06, 0);
                shoulderPivot.add(sleeve);

                const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.3, 16), skinMat);
                upperArm.position.set(0, -0.15, 0);
                shoulderPivot.add(upperArm);

                const elbowPivot = new THREE.Group();
                elbowPivot.position.set(0, -0.3, 0);
                shoulderPivot.add(elbowPivot);

                const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.28, 16), skinMat);
                lowerArm.position.set(0, -0.14, 0);
                elbowPivot.add(lowerArm);

                const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), skinMat);
                hand.position.set(0, -0.31, 0);
                elbowPivot.add(hand);

                return { shoulder: shoulderPivot, elbow: elbowPivot, hand: hand };
            }
            const leftArm = createArm(false);
            const rightArm = createArm(true);

            // Legs
            function createLeg(isRight) {
                const sign = isRight ? 1 : -1;
                const hipPivot = new THREE.Group();
                hipPivot.position.set(sign * 0.1, 0.8, 0); // aligned with torso group
                person.add(hipPivot);

                const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.45, 16), pantsMat);
                thigh.position.set(0, -0.225, 0);
                hipPivot.add(thigh);

                const kneePivot = new THREE.Group();
                kneePivot.position.set(0, -0.45, 0);
                hipPivot.add(kneePivot);

                const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 16), pantsMat);
                calf.position.set(0, -0.225, 0);
                kneePivot.add(calf);

                const shoeGeo = new THREE.SphereGeometry(0.08, 16, 16);
                const shoe = new THREE.Mesh(shoeGeo, shoeMat);
                shoe.scale.set(1, 0.7, 1.5);
                shoe.position.set(0, -0.45, 0.04);
                kneePivot.add(shoe);

                return { hip: hipPivot, knee: kneePivot };
            }
            const leftLeg = createLeg(false);
            const rightLeg = createLeg(true);

            // Return rigid parts for animation
            person.userData = {
                torso: torsoGroup, head: headPivot,
                lShoulder: leftArm.shoulder, lElbow: leftArm.elbow, lHand: leftArm.hand,
                rShoulder: rightArm.shoulder, rElbow: rightArm.elbow, rHand: rightArm.hand,
                lHip: leftLeg.hip, lKnee: leftLeg.knee,
                rHip: rightLeg.hip, rKnee: rightLeg.knee
            };
            return person;
        }

        canvases.forEach((canvasDiv, index) => {
            if (!canvasDiv) return;

            const scene = new THREE.Scene();
            // Optional: subtle fog to blend into background
            scene.fog = new THREE.FogExp2(0xffffff, 0.05);

            const camera = new THREE.PerspectiveCamera(45, canvasDiv.clientWidth / canvasDiv.clientHeight, 0.1, 100);
            camera.position.set(2, 1.5, 4); // Positioned for a good 3/4 angle view

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            // Add soft shadows
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            canvasDiv.appendChild(renderer.domElement);

            // Add OrbitControls for interactivity
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enablePan = false;
            controls.minDistance = 2;
            controls.maxDistance = 6;
            // Prevent looking from below the floor
            controls.maxPolarAngle = Math.PI / 2 - 0.05;
            controls.target.set(0, 0.5, 0);

            // Lighting Setup for realism
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(5, 8, 3);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 1024;
            dirLight.shadow.mapSize.height = 1024;
            dirLight.shadow.camera.near = 0.5;
            dirLight.shadow.camera.far = 15;
            dirLight.shadow.camera.left = -2;
            dirLight.shadow.camera.right = 2;
            dirLight.shadow.camera.top = 2;
            dirLight.shadow.camera.bottom = -2;
            scene.add(dirLight);

            const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.3);
            fillLight.position.set(-5, 3, -5);
            scene.add(fillLight);

            // Add a realistic platform/floor
            const floorGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.1, 32);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0xf3f4f6,
                roughness: 0.8,
                metalness: 0.1
            });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.position.y = -0.05;
            floor.receiveShadow = true;
            scene.add(floor);

            // Ethiopia relevant skin tones and colors
            const skinTones = [0x5C3A21, 0x754C29, 0x482A15, 0x8D5524, 0x603C24];
            const shirtColors = [0xc91c1c, 0x1e40af, 0xf59e0b, 0x10b981, 0x3b82f6];

            const person = createHuman(skinTones[index % skinTones.length], shirtColors[index % shirtColors.length], 0x1f2937);

            // Enable shadows for the character
            person.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(person);

            const u = person.userData;
            let time = 0;

            // Scenario Setup
            if (index === 0) { // Step 1: Eligibility (Clipboard)
                const boardGroup = new THREE.Group();
                const boardGeo = new THREE.BoxGeometry(0.3, 0.4, 0.02);
                const boardMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
                const paperGeo = new THREE.BoxGeometry(0.28, 0.38, 0.021);
                const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
                boardGroup.add(new THREE.Mesh(boardGeo, boardMat));
                boardGroup.add(new THREE.Mesh(paperGeo, paperMat));

                boardGroup.position.set(0, -0.05, 0.05);
                boardGroup.rotation.x = -Math.PI / 6;
                u.lHand.add(boardGroup);

                u.lShoulder.rotation.x = -Math.PI / 3;
                u.lElbow.rotation.x = -Math.PI / 2;
                u.lShoulder.rotation.z = Math.PI / 8;
                u.rShoulder.rotation.z = -Math.PI / 16;
                u.torso.rotation.y = Math.PI / 8;

            } else if (index === 1) { // Step 2: Register (Writing)
                const desk = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0xe5e7eb }));
                desk.position.set(0, 0.8, 0.3);
                person.add(desk);

                u.torso.rotation.x = Math.PI / 12; // lean forward
                u.head.rotation.x = Math.PI / 8; // look down

                u.lShoulder.rotation.x = -Math.PI / 4;
                u.lElbow.rotation.x = -Math.PI / 4;
                u.lShoulder.rotation.z = Math.PI / 8;

                u.rShoulder.rotation.x = -Math.PI / 3;
                u.rElbow.rotation.x = -Math.PI / 3;
                u.rShoulder.rotation.z = -Math.PI / 8;

            } else if (index === 2) { // Step 3: Screening (Heart Pulse)
                const heartGeo = new THREE.SphereGeometry(0.15, 16, 16);
                heartGeo.scale(1, 1, 0.5);
                const heart = new THREE.Mesh(heartGeo, new THREE.MeshStandardMaterial({ color: 0xc91c1c }));
                heart.position.set(0, 1.4, 0.4);
                person.add(heart);
                u.heart = heart;

                u.lShoulder.rotation.x = -Math.PI / 6;
                u.lElbow.rotation.x = -Math.PI / 2;
                u.rShoulder.rotation.x = -Math.PI / 6;
                u.rElbow.rotation.x = -Math.PI / 2;

            } else if (index === 3) { // Step 4: Donate 
                const chair = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), new THREE.MeshStandardMaterial({ color: 0x374151 }));
                chair.position.set(0, 0.25, 0);
                person.add(chair);

                const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), new THREE.MeshStandardMaterial({ color: 0x9ca3af }));
                stand.position.set(-0.5, 0.6, 0.2);
                person.add(stand);

                // Sitting pose
                u.lHip.rotation.x = -Math.PI / 2;
                u.rHip.rotation.x = -Math.PI / 2;
                u.lKnee.rotation.x = Math.PI / 2;
                u.rKnee.rotation.x = Math.PI / 2;
                u.torso.position.y = 0.5;
                u.lHip.position.y = 0.5;
                u.rHip.position.y = 0.5;

                u.lShoulder.rotation.z = Math.PI / 2.5; // arm out
                u.lElbow.rotation.y = -Math.PI / 8;

                const drop = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshStandardMaterial({ color: 0xc91c1c }));
                u.lHand.add(drop);
                u.drop = drop;

            } else if (index === 4) { // Step 5: Recover 
                const chair = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), new THREE.MeshStandardMaterial({ color: 0x374151 }));
                chair.position.set(0, 0.25, 0);
                person.add(chair);

                // Sitting pose
                u.lHip.rotation.x = -Math.PI / 2;
                u.rHip.rotation.x = -Math.PI / 2;
                u.lKnee.rotation.x = Math.PI / 2;
                u.rKnee.rotation.x = Math.PI / 2;
                u.torso.position.y = 0.5;
                u.lHip.position.y = 0.5;
                u.rHip.position.y = 0.5;

                const cookie = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xd2691e }));
                cookie.rotation.x = Math.PI / 2;
                cookie.position.set(0, -0.05, 0);
                u.rHand.add(cookie);
                u.cookie = cookie;
            }

            // Animation Loop
            const animate = function () {
                requestAnimationFrame(animate);
                time += 0.05;

                controls.update(); // smoothly update orbit controls

                // Subtle breathing and bouncing for all standing
                if (index !== 3 && index !== 4) {
                    u.torso.scale.y = 1 + Math.sin(time * 2) * 0.015;
                    u.torso.scale.x = 1 + Math.sin(time * 2) * 0.005;
                } else {
                    u.torso.scale.y = 1 + Math.sin(time * 1.5) * 0.01;
                }

                if (index === 0) {
                    u.head.rotation.y = Math.sin(time * 1.5) * 0.15; // looking back and forth
                } else if (index === 1) {
                    // Writing motion
                    u.rElbow.rotation.y = Math.sin(time * 6) * 0.1;
                    u.rShoulder.rotation.x = -Math.PI / 3 + Math.sin(time * 4) * 0.05;
                } else if (index === 2) {
                    // Beating heart
                    if (u.heart) {
                        const s = 1 + Math.abs(Math.sin(time * 3.5)) * 0.2;
                        u.heart.scale.set(s, s, s * 0.5);
                        u.heart.position.y = 1.4 + Math.sin(time * 2) * 0.05;
                    }
                } else if (index === 3) {
                    if (u.drop) {
                        const progress = (time * 1.2) % 2;
                        u.drop.position.set(0, -progress * 0.5, 0);
                        u.drop.scale.setScalar(Math.max(0, 1 - progress * 0.5));
                    }
                } else if (index === 4) {
                    // Eating motion
                    const cycle = (Math.sin(time * 2) + 1) / 2; // 0 to 1
                    u.rShoulder.rotation.x = -Math.PI / 2 * cycle - Math.PI / 6;
                    u.rElbow.rotation.x = -Math.PI / 1.5 * cycle;
                    u.head.rotation.x = Math.PI / 12 * cycle;
                }

                // Removed auto-rotation so OrbitControls can take full control
                // person.rotation.y = Math.sin(time * 0.3) * 0.2;

                renderer.render(scene, camera);
            };

            animate();

            // Resize handling
            window.addEventListener('resize', () => {
                if (!canvasDiv) return;
                const w = canvasDiv.clientWidth;
                const h = canvasDiv.clientHeight;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            });

        });
    }

    initHowToDonate3D();
});
