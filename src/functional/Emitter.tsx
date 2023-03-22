
import React from "react";

/* Interfaces */
interface ParticleEmitterOptions {
    /**
    * Amount of particles.
    * Defaults to 10
    **/
    num_particles: number | undefined,
    lifetime: number
}
interface ParticleOptions {
    /**
    * Delta y (force)
    **/
    dy: number,

    /**
    * Delta x (force)
    **/
    dx: number,

    x_start_width: number,
    spread_x: number
}

/* Imports */
export class ParticleEmitter extends React.PureComponent<ParticleEmitterOptions, {
    particles: Particle[]
}> {

    /* Types */
    num_particles: number;
    lifetime: number;

    /* Constructor */
    constructor(props: ParticleEmitterOptions) {
        super(props);
        this.num_particles = props.num_particles ?? 10;
        this.lifetime = this.props.lifetime;

        this.state = {
            particles: Array.from({ length: this.num_particles }, () => new Particle({
                dx: 1,
                dy: 2.5,
                x_start_width: 40,
                spread_x: 3
            }))
        };
    };

    componentDidMount(): void {
        let index = 0;

        let particleinterval = setInterval(() => {
            if (index > this.lifetime) {
                clearInterval(particleinterval);
                this.setState({ particles: [] });
            };

            this.setState({
                particles: this.state.particles.map(particle => {
                    particle.update();
                    return particle;
                })
            });

            index++;
        }, 10);
    }

    render() {
        return (
            <div className="particle-container">
                {
                    this.state.particles.map((e, index) =>
                        <div
                            key={index}
                            className="particle"
                            style={{
                                transform: `translate(
                                    ${e.posx}px,
                                    ${e.posy}px
                                ) rotate(${e.rotation}deg)`,
                                left: e.start_posx + "%",
                                top: e.start_posy + "%",
                            }}
                        />
                    )
                }
            </div>
        )
    }
}

class Particle {
    /* Types */
    dx: number;
    dy: number;
    dx_inc: number;
    dy_inc: number;

    rotation: number;

    posx: number;
    posy: number;

    start_posx: number;
    start_posy: number;

    /* Constructor */
    constructor(props: ParticleOptions) {
        
        /* Delta x & y */
        this.dx = props.dx;
        this.dy = props.dy;

        this.start_posx = (50 + props.x_start_width/2) - Math.random() * props.x_start_width;
        this.start_posy = Math.random() * 100;

        this.dx_inc = - (Math.random() * (50 - this.start_posx) + (50 - this.start_posx) / 2) / 8;
        this.dy_inc = (Math.random() * 2 + 1) / 100;

        this.posx = 0;
        this.posy = 0;
        this.rotation = 0;

        /* Bindings */
        this.update = this.update.bind(this);
        this.get_position = this.get_position.bind(this);
    }

    /* Update step */
    update() {
        this.dy -= this.dy_inc;
        this.dy_inc = this.dy_inc * 1.02;
        // this.dx += this.dx_inc;

        this.posx += this.dx_inc;
        this.posy -= this.dy;

        this.rotation = (Math.atan2(this.dx_inc, this.dy) * 180 / Math.PI);
    }

    get_position() {
        return {
            x: this.posx,
            y: this.posy
        }
    }
}