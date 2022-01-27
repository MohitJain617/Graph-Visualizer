
let drawCanvas = ()=>{

	const bgclr = "#2F2A3E"
	const purpleclr = "#7f64E7";
	const cyanclr = "#BDE0FE";
	const canvas = document.getElementById("canvas1");
	const canpar = document.querySelector(".graph");
	const ctx = canvas.getContext('2d');
	let r = 20;

	setup();
	window.addEventListener('resize',setup)
	function setup(){
		canvas.height = canpar.clientHeight;
		canvas.width = canpar.clientWidth;
	}
	const graph = {
		nodes: [],
		links: []
	};
	class Node {
		constructor(idx){
			this.idx = idx;
			// this.x = Math.random() * canvas.width;
			this.x = 100;
			// this.y = Math.random() * canvas.height;
			this.y = 100;
			this.size = r;
			// this.color = colors[Math.floor(Math.random() * colors.length)];
			this.color = purpleclr;
		}
		draw(){
			ctx.fillStyle = bgclr;
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			// ID printing
			ctx.font = "30px Sans-serif";
			ctx.fillStyle = cyanclr;
			ctx.textAlign = "center";
			ctx.fillText(this.idx+1,this.x,this.y+10)
		}
	}

	function init(){
		let input = document.getElementById("inputText").value;
		input = input.trim().split(/\s+/);
		let n = parseInt(input[0]);
		let m = parseInt(input[1]);
		for(let i = 0; i < n; i++){
			graph.nodes.push(new Node(i))
		}
		if(input.length % 2 !== 0) alert("Invalid inputs");
		else {
			for(let i = 2; i < input.length; i+=2){
				let a = parseInt(input[i]);
				a--;
				let b = parseInt(input[i+1]);
				b--;
				graph.links.push({source: a, target: b});
			}
		}
		// graph.links.push({source: 0, target: 1});
		// graph.links.push({source: 0, target: 2});
		// graph.links.push({source: 1, target: 3});
		// graph.links.push({source: 1, target: 4});
		// graph.links.push({source: 6, target: 7});
		// graph.links.push({source: 6, target: 5});
		// graph.links.push({source: 5, target: 7});
	}

	//draws link given 2 nodes
	function drawLink(n1, n2){
		ctx.beginPath();
		ctx.strokeStyle = purpleclr;
		ctx.moveTo(n1.x, n1.y);
		ctx.lineTo(n2.x, n2.y);
		ctx.lineWidth = 4;
		ctx.stroke();
	}
	function drawGraph(){
		ctx.clearRect(0,0,canvas.width,canvas.height)
		graph.links.forEach(function(me){
			drawLink(me.source,me.target);
		})
		graph.nodes.forEach(function(me){
			me.draw();
		});
	}
	init();

	//------D3 Simulation Logic-----------
	let simulation = d3.forceSimulation()
		.force("x",d3.forceX(canvas.width/2))
		.force("y",d3.forceY(canvas.height/2))
		.force("collide",d3.forceCollide(r+2))
		.force("charge", d3.forceManyBody().strength(-400))
		.force("link", d3.forceLink().strength(0.05))
		.on('tick',drawGraph);

	simulation.nodes(graph.nodes);
	simulation.force("link").links(graph.links);

	//The code snippet to allow dragging of nodes
	// Inspired by https://observablehq.com/@d3/force-directed-graph

	// Copyright 2021 Observable, Inc.
	// Released under the ISC license.
	// https://observablehq.com/@d3/force-directed-graph
	let dragsubject = () => {
		return simulation.find(d3.event.x, d3.event.y);
	}
	let dragstarted = () => {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d3.event.subject.fx = d3.event.subject.x;
		d3.event.subject.fy = d3.event.subject.y;
	}
	let dragged = () => {
		d3.event.subject.fx = d3.event.x;
		d3.event.subject.fy = d3.event.y;
	}
	let dragended = () => {
		if(!d3.event.active) simulation.alphaTarget(0);
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}

	d3.select(canvas)
		.call(d3.drag()
			.container(canvas)
			.subject(dragsubject)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));


	//------------------------------------
	drawGraph();
}

let play = document.getElementById("playButton");
play.addEventListener("click", drawCanvas);