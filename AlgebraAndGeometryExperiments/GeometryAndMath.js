
function getLinesIntersection(l1, l2){
	/*
		*
		* a1 = (l1.y2-l1.y1)/(l1.x2-l1.x1)
		* a2 = (l2.y2-l2.y1)/(l2.x2-l2.x1)
		* 
		* Using Second line like base
		*
		* ry = l2.y1+(l2.x1-l1.x1)*a2
		* l1.y1+(xe*a1) = (xe*a2)+ry
		*
		** l1.y1+(xe*a1)-ry = xe*a2
		** l1.y1-ry = xe*a2-xe*a1
		** (l1.y1-ry)/xe = a2-a1
		** 1/xe = (a2-a1)/(l1.y1-ry)
		** xe = (l1.y1-ry)/(a2-a1)
		*
		*
	*/
	var a1 = (l1[3]-l1[1])/(l1[2]-l1[0]);
	var a2 = (l2[3]-l2[1])/(l2[2]-l2[0]);
	var ry = l2[1]+(l1[0]-l2[0])*a2;
	var xe = (l1[1]-ry)/(a2-a1)
	var x = l1[0]+xe;
	var y = l1[1]+xe*a1;
	var inl1 = ((x>=l1[0]&&x<=l1[2])||(x>=l1[2]&&x<=l1[0]));
	var inl2 = ((x>=l2[0]&&x<=l2[2])||(x>=l2[2]&&x<=l2[0]));
	return [x, y,
		inl1&&inl2, inl1, inl2
	];
}

function isClockwiseSegments(vs){
	var total = 0;
	for(var i=0; i<vs.length; i++){
		var act = vs[i];
		var nxt = vs[(i+1)%vs.length];
		total += (nxt.x-act.x)*(nxt.y+act.y);
	}
	return total>=0;
}
