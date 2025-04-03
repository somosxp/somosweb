import AwardButton from "../AwardButton.jsx";
import SectionTitle from "../SectionTitle.tsx";
import { useEffect, useRef, useState } from "react";

import Matter from "matter-js";

interface Award {
  id: number;
  title: string;
  image: string;
  years: string[];
  description: string;
}

const HomeAwardsReact = ({ awards }: { awards: Award[] }) => {
  const [currentAward, setCurrentAward] = useState<Award | null>(null);
  const matterContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const circlesRef = useRef<Matter.Body[]>([]);

  const handleClickAward = (award: Award) => {
    if (currentAward !== null && currentAward.id !== award.id) {
      const currentAwardIndex = awards.findIndex(
        (a) => a.id === currentAward.id
      );
      Matter.Body.scale(circlesRef.current[currentAwardIndex], 0.53, 0.53);
    }
    setCurrentAward(award);
  };

  useEffect(() => {
    if (currentAward === null) {
      setCurrentAward(awards[0]);
    }
  }, [awards]);

  useEffect(() => {
    if (currentAward === null) return;
    Matter.Body.scale(circlesRef.current[currentAward.id - 1], 1.8, 1.8);
  }, [currentAward]);

  useEffect(() => {
    if (!matterContainerRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Composite,
      Bodies,
      Mouse,
      MouseConstraint,
    } = Matter;

    const background = "#121212";
    const height = 600;
    const element = matterContainerRef.current;

    // Crear el motor de Matter.js
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // Crear el render
    const render = Render.create({
      element,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: window.innerWidth,
        height,
        background,
        wireframes: false,
      },
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    let totalCircles = 0;
    const totalCirclePerSize = {
      0: 5,
      960: 12,
      1280: 24,
    };

    const currentWindowWidth = window.innerWidth;
    Object.keys(totalCirclePerSize).forEach((key) => {
      const index = parseInt(key);
      if (currentWindowWidth >= index) {
        totalCircles = totalCirclePerSize[index];
      }
    });
    // Crear círculos para los premios
    const circles = Array.from({ length: totalCircles }).map((_, index) => {
      let size = 30;
      if (index >= 0 && index <= awards.length) {
        // random between 300, 270, 250
        size = Math.random() * (300 - 270) + 270;
      } else if (index >= 4) {
        size = Math.random() * (180 - 40) + 40;
      }

      const circle = Bodies.circle(
        Math.random() * window.innerWidth,
        Math.random() * height,
        size / 2,
        {
          restitution: 0.2,
          friction: 1,
          label: `circle-${index + 1}`,
          render: {
            fillStyle: "rgba(255, 255, 255)",
          },
        }
      );

      Composite.add(world, circle);
      return circle;
    });

    circlesRef.current = circles;
    Composite.add(world, circles);

    // Añadir bordes para que no salgan de la pantalla
    Composite.add(world, [
      Bodies.rectangle(
        element.clientWidth / 2,
        height - 25,
        element.clientWidth,
        10,
        { isStatic: true, render: { fillStyle: background } }
      ),
      Bodies.rectangle(element.clientWidth / 2, 0, element.clientWidth, 10, {
        isStatic: true,
        render: { fillStyle: background },
      }),
      Bodies.rectangle(0, height / 2, 10, height, {
        isStatic: true,
        render: { fillStyle: background },
      }),
      Bodies.rectangle(element.clientWidth, height / 2 + 2, 19, height, {
        isStatic: true,
        render: { fillStyle: background },
      }),
    ]);

    // Agregar control de ratón
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(world, mouseConstraint);

    // Cleanup al desmontar el componente
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null as any;
      render.context = null as any;
    };
  }, [awards]);

  // **Sincronizar los botones con los círculos en tiempo real**
  useEffect(() => {
    const syncButtons = () => {
      awards.forEach((award, index) => {
        const button = document.querySelector(
          `button[data-id="circle-${index}"]`
        );
        const circle = circlesRef.current[index];
        if (button && circle) {
          button.style.position = "absolute";
          button.style.left = `${circle.position.x - button.offsetWidth / 2}px`;
          button.style.top = `${circle.position.y - button.offsetHeight / 2}px`;

          button.style.width = `${circle.circleRadius * 2}px`;
          button.style.height = `${circle.circleRadius * 2}px`;
        }
      });
      requestAnimationFrame(syncButtons);
    };
    syncButtons();
  }, [awards]);

  return (
    <section className="w-full relative overflow-hidden bg-[#121212] text-white">
      <div className="grid md:grid-cols-2 py-10 px-6 lg:p-20 relative z-10">
        <SectionTitle title="Awards" class="text-white" />
        {currentAward !== null && (
          <article className="mt-6 lg:mt-0">
            <h3 className="text-xl award-name">{currentAward.title}</h3>
            <ul className="text-[#808080] flex gap-x-2 divide-x-1 divide-solid divide-[#808080] [&>li]:pr-2 award-years">
              {currentAward.years.map((year: string) => (
                <li key={year}>{year}</li>
              ))}
            </ul>
            <p className="award-description mt-4">
              El reconocimiento a nuestro trabajo nos impulsa a seguir creando
              experiencias inolvidables. A lo largo de los años, hemos recibido
              premios que avalan nuestra creatividad, innovación y compromiso
              con la excelencia. Cada galardón es un reflejo de la pasión que
              ponemos en cada proyecto.
            </p>
          </article>
        )}
      </div>
      <div className="relative">
        <div id="buttons" className="absolute top-0 left-0 z-10 text-black">
          {awards.map(({ id, title, image }, index) => (
            <AwardButton
              isActive={currentAward && currentAward.id === id}
              key={index}
              onClick={() => handleClickAward(awards[index])}
              index={index}
              title={title}
              image={image}
            >
              {title}
            </AwardButton>
          ))}
        </div>
        <div
          ref={matterContainerRef}
          id="matter-container"
          className="relative h-screen"
        >
          <canvas ref={canvasRef} id="matter-canvas"></canvas>
        </div>
      </div>
    </section>
  );
};

export default HomeAwardsReact;
