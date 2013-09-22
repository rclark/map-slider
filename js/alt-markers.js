L.SquareMarker = L.Polyline.extend({
	options: {
		size: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Polyline.prototype.initialize.call(this, latlng, options);
		this._size = this.options.size;
	},

	projectLatlngs: function () {
		var
			center = this._map.latLngToLayerPoint(this._latlngs[0]),
			halfSize = Math.round(this._size / 2)
		;
		this._originalPoints = [
			{ x: center.x - halfSize, y: center.y - halfSize },
			{ x: center.x + halfSize, y: center.y - halfSize },
			{ x: center.x + halfSize, y: center.y + halfSize },
			{ x: center.x - halfSize, y: center.y + halfSize },
			{ x: center.x - halfSize, y: center.y - halfSize }
		];
	},

	setSize: function (size) {
		this._size = size;
		return this.redraw();
	}
});

L.squareMarker = function (latlng, options) {
	return new L.SquareMarker(latlng, options);
};

L.TriangleMarker = L.Polyline.extend({
	options: {
		size: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Polyline.prototype.initialize.call(this, latlng, options);
		this._size = this.options.size;
	},

	projectLatlngs: function () {
		var
			center = this._map.latLngToLayerPoint(this._latlngs[0]),
			halfSize = Math.round(this._size / 2)
		;
		this._originalPoints = [
			{ x: center.x , y: center.y },
			{ x: center.x - halfSize, y: center.y - this._size },
			{ x: center.x + halfSize, y: center.y - this._size },
			{ x: center.x, y: center.y }
		];
	},

	setSize: function (size) {
		this._size = size;
		return this.redraw();
	}
});

L.triangleMarker = function (latlng, options) {
	return new L.TriangleMarker(latlng, options);
};