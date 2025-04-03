'use client'

import SectionTitle from "@components/SectionTitle";
import type { Award } from "@lib/types"
import { useRef, useEffect, useState } from "react"

interface HomeAwardsP5Props {
  awards: Award[];
}

export default function HomeAwardsP5({ awards }: HomeAwardsP5Props) {
  const canvasRef = useRef(null)
  const [currentAward, setCurrentAward] = useState<Award | null>(null)

  const background = "#121212";
  const height = 400;

  const handleClickAward = (award: Award) => {
    setCurrentAward(award)
  }

  useEffect(() => {
    import('p5').then((p5Module) => {
      const p5 = p5Module.default

      class Ball {
        id: number;
        width: number;
        preW: number;
        postW: number;
        e: Ball[];
        position: any;
        velocity: any;
        acceleration: any;
        gravity: number;
        friction: number;
        spring: number;
        open: boolean;
        img: any;
        rotationAngle: number;
        rotationSpeed: number;
        name: string;

        constructor(p: any, x: number, y: number, width: number, e: Ball[], img: any, name: string) {
          this.id = e.length;
          this.width = width;
          this.preW = width;
          this.postW = width * 1.5;
          this.e = e;
          this.position = p.createVector(x + p.random(-1, 1), y);
          this.velocity = p.createVector(0, 0);
          this.acceleration = p.createVector(0, 0);
          this.gravity = 0.2;
          this.friction = 0.5;
          this.spring = 1;
          this.open = false;
          this.img = img;
          this.name = name;
          this.rotationAngle = p.random(p.TWO_PI);
          this.rotationSpeed = p.random(-0.001, 0.001);
        }

        collide(p: any) {
          for (let i = this.id + 1; i < this.e.length; i++) {
            let dx = this.e[i].position.x - this.position.x;
            let dy = this.e[i].position.y - this.position.y;
            let distance = p.sqrt(dx * dx + dy * dy);
            let minDist = this.e[i].width / 2 + this.width / 2;

            if (distance <= minDist) {
              let angle = p.atan2(dy, dx);
              let targetX = this.position.x + p.cos(angle) * minDist;
              let targetY = this.position.y + p.sin(angle) * minDist;

              this.acceleration.set(
                (targetX - this.e[i].position.x) * this.spring,
                (targetY - this.e[i].position.y) * this.spring
              );
              this.velocity.sub(this.acceleration);
              this.e[i].velocity.add(this.acceleration);
              this.velocity.mult(this.friction);
            }
          }
        }

        move(p: any) {
          this.velocity.add(p.createVector(0, this.gravity));
          this.position.add(this.velocity);
          this.rotationAngle += this.rotationSpeed;
        }

        checkBoxCollisions(p: any) {
          if (this.position.x > p.width - this.width / 2) {
            this.velocity.x *= -this.friction;
            this.position.x = p.width - this.width / 2;
          } else if (this.position.x < this.width / 2) {
            this.velocity.x *= -this.friction;
            this.position.x = this.width / 2;
          }

          if (this.position.y > p.height - this.width / 2) {
            this.velocity.x -= this.velocity.x / 100;
            this.velocity.y *= -this.friction;
            this.position.y = p.height - this.width / 2;
          } else if (this.position.y < this.width / 2) {
            this.velocity.y *= -this.friction;
            this.position.y = this.width / 2;
          }
        }

        display(p: any) {
          p.noStroke();
          p.imageMode(p.CENTER);
          p.push();
          p.translate(this.position.x, this.position.y);
          p.rotate(this.rotationAngle);
          if (this.open) {
            this.width = this.postW;
            p.image(this.img, 0, 0, this.width, this.width);
          } else {
            this.width = this.preW;
            p.ellipse(0, 0, this.width, this.width);
            p.fill(0);
            p.strokeWeight(1);
            p.textSize(this.width/10);
            p.textAlign(p.CENTER);
            p.text(this.name, 0, 0);
            p.text("+", 0, this.width/10);
          }
          p.pop();
        }

        isClicked(p: any) {
          const d = p.dist(p.mouseX, p.mouseY, this.position.x, this.position.y);
          if (d < this.width / 2) {
            this.open = !this.open;
          } else {
            this.open = false;
          }
        }
      }

      const sketch = (p: any) => {
        let balls: Ball[] = [];
        let awardImages: any[] = [];

        p.preload = () => {
          awardImages = awards.map(award => p.loadImage(award.image));
        }

        p.setup = () => {
          p.createCanvas(window.innerWidth - 20, height);

          awards.forEach((award, index) => {
            const image = awardImages[index]
            const width = p.random(30, 200)
            const height = width

            const mask = p.createGraphics(width, height);
            mask.ellipse(
              width / 2,
              height / 2,
              width,
              height
            );

            image.mask(mask);
            let newBall = new Ball(
              p,
              p.random(p.width),
              p.random(p.height),
              p.random(30, 200),
              balls,
              image,
              award.title
            );

            balls.push(newBall);
          })

          if (balls[0]) {
            balls[0].open = true
            handleClickAward(awards[0])
          }
        }

        p.draw = () => {
          p.background(background);

          balls.forEach(ball => {
            ball.move(p);
            ball.checkBoxCollisions(p);
            ball.collide(p);
            ball.display(p);
          });
        }

        p.mousePressed = () => {
          balls.forEach(ball => ball.isClicked(p));
          const openedIndex = balls.findIndex(ball => ball.open)
          if (openedIndex !== -1) {
            handleClickAward(awards[openedIndex])
          }
        }
      }

      const p5Instance = new p5(sketch, canvasRef.current!)

      return () => {
        p5Instance.remove()
      }
    })
  }, [awards])

  return (
    <section className="w-full relative overflow-hidden bg-[#121212] text-white">
      <div className="grid md:grid-cols-2 py-10 px-6 lg:p-20 relative z-10">
        {currentAward !== null && (
          <>
            <SectionTitle title="Awards" class="text-white" />
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
          </>
        )}
      </div>
      <div ref={canvasRef}></div>
    </section>
  )
}