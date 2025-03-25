"use client"

import React, {useEffect, useRef, useState} from "react"
import { Particle } from "@/lib/interfaces"
import QrCode from "qrcode"
import { motion } from "framer-motion"
import { RefreshCcw, Search, Lock } from "lucide-react"

export function Hero() : React.JSX.Element {
    return <>
        <main>
            {/* Hero Section */}
            <section className="px-4 h-full relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-background flex items-center justify-center">
                {/* Background particles */}
                <QRBackgroundParticles />

                <div className="container relative z-10 h-full flex items-center justify-center py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                        {/* Left Content */}
                        <div className="space-y-6 text-center lg:text-left">
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Transform Your Elements into QR Codes
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                                Create professional QR codes instantly. Whether you need static codes for permanent links or dynamic codes for evolving content, we've got you covered.
                            </p>
                        </div>

                        {/* Right QR Code Animation */}
                        <div className="hidden relative h-full sm:flex items-center justify-center p-8">
                            <QRCodeAnimation />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Lock className="h-5 2-5 !text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Private QR</h3>
                        <p className="text-muted-foreground">Protected your qr with password</p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Search className="h-5 w-5 !text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">QR Analysis</h3>
                        <p className="text-muted-foreground">Scan log of the qr code</p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <RefreshCcw className="h-5 w-5 !text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Easy Updates</h3>
                        <p className="text-muted-foreground">Modify dynamic QR codes anytime without reprinting</p>
                    </div>
                </div>
            </section>
        </main>
    </>
}

const QRBackgroundParticles = () : React.JSX.Element => {
    const [particles, setParticles] = useState<Particle[]>([])
    const gridSize: number = 20
    const particleSize: number = 6

    useEffect(() => {
        const generateParticles = () => {
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight
            const cols = Math.ceil(viewportWidth / gridSize)
            const rows = Math.ceil(viewportHeight / gridSize)

            const newParticles: Particle[] = []

            for (let i = 0; i < rows * cols; i++) {
                const col = i % cols
                const row = Math.floor(i / cols)

                const x = col * gridSize
                const y = row * gridSize

                const offsetX = (Math.random() - 0.5) * gridSize * 0.5
                const offsetY = (Math.random() - 0.5) * gridSize * 0.5

                newParticles.push({
                    x: x + offsetX,
                    y: y + offsetY,
                    initialX: x,
                    initialY: y,
                    size: particleSize,
                    isQRPixel: Math.random() > 0.9, // 10% chance to be a QR pixel
                    scatterX: x + (Math.random() - 0.5) * 200,
                    scatterY: y + (Math.random() - 0.5) * 200,
                })
            }

            setParticles(newParticles)
        }

        generateParticles()
        window.addEventListener('resize', generateParticles)

        return () => {
            window.removeEventListener('resize', generateParticles)
        }
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-sm ${
                        particle.isQRPixel ? 'bg-primary/80' : 'bg-secondary/30'
                    }`}
                    initial={{
                        width: particle.size,
                        height: particle.size,
                        x: particle.scatterX,
                        y: particle.scatterY,
                        opacity: 0.3
                    }}
                    animate={{
                        x: particle.initialX,
                        y: particle.initialY,
                        opacity: particle.isQRPixel ? 0.8 : 0.3,
                        transition: {
                            type: "spring",
                            stiffness: 50 + Math.random() * 50,
                            damping: 10 + Math.random() * 10,
                            delay: Math.random() * 0.5
                        }
                    }}
                    whileHover={{
                        scale: 1.5,
                        opacity: 1,
                        transition: { duration: 0.2 }
                    }}
                />
            ))}
        </div>
    )
}

const QRCodeAnimation = () : React.JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [ particles, setParticles ] = useState<Particle[]>([])
    const [ isHovered, setIsHovered ] = useState<boolean>(false)
    const gridSize: number = 10
    const canvasSize: number = 300

    useEffect(() => {
        const generateQR = async () => {
            if(!canvasRef.current) return

            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")

            if(!ctx) return
            await QrCode.toCanvas(canvas, 'https://www.qrnetic.it', {
                width: canvasSize,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                }
            })

            const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize)
            const data = imageData.data
            const newParticles: Particle[] = []
            const totalCells = Math.floor(canvasSize / gridSize)

            for(let row = 0; row < totalCells; row++) {
                for(let col = 0; col < totalCells; col++) {
                    const x = col * gridSize
                    const y = row * gridSize

                    const centerX = Math.floor(x + gridSize / 2)
                    const centerY = Math.floor(y + gridSize / 2)

                    const index = (centerY * canvasSize + centerX) * 4
                    const isQRPixel = data[index] === 0

                    if(isQRPixel) {
                        const scatterRadius = 200
                        const angle = Math.random() * Math.PI * 2
                        const distance = Math.random() * scatterRadius

                        newParticles.push({
                            x,
                            y,
                            initialX: x,
                            initialY: y,
                            size: gridSize - 1,
                            isQRPixel: true,
                            scatterX: x + Math.cos(angle) * distance,
                            scatterY: y + Math.cos(angle) * distance,
                        })
                    }
                }
            }

            setParticles(newParticles)
        }

        generateQR()
    }, [])

    return <>
        <div className="relative w-[300px] h-[300px] bg-black/10 dark:bg-white/10 rounded-lg">
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="absolute top-0 left-0 opacity-0"
            />
            <div
                className="relative w-full h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-purple-500 rounded-sm"
                        initial={{
                            width: particle.size,
                            height: particle.size,
                            x: particle.scatterX,
                            y: particle.scatterY,
                            opacity: 0.6
                        }}
                        animate={isHovered ? {
                            x: particle.initialX,
                            y: particle.initialY,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: Math.random() * 0.2
                            }
                        } : {
                            x: particle.scatterX,
                            y: particle.scatterY,
                            opacity: 0.6,
                            scale: 0.8,
                            transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                delay: Math.random() * 0.1
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    </>
}