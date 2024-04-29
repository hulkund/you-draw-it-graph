var data = [
  {"year": 2000, "price": 349000},
  {"year": 2001, "price": 392645},
  {"year": 2002, "price": 387000},
  {"year": 2003, "price": 412500},
  {"year": 2004, "price": 483000},
  {"year": 2005, "price": 530000},
  {"year": 2006, "price": 522732},
  {"year": 2007, "price": 536500},
  {"year": 2008, "price": 550000},
  {"year": 2009, "price": 530000},
  {"year": 2010, "price": 580000},
  {"year": 2011, "price": 617500},
  {"year": 2012, "price": 621000},
  {"year": 2013, "price": 650000},
  {"year": 2014, "price": 739000},
  {"year": 2015, "price": 790000},
  {"year": 2016, "price": 845000},
  {"year": 2017, "price": 920000},
  {"year": 2018, "price": 995000},
  {"year": 2019, "price": 1102500},
  {"year": 2020, "price": 1093750},
  {"year": 2021, "price": 980000},
  {"year": 2022, "price": 1075000}
]


var ƒ = d3.f

var sel = d3.select('#infographie').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: sel.node().offsetWidth, 
  height: 400, 
  margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.x.domain([2000, 2022])
c.y.domain([0, 1200000])

c.xAxis.ticks(10).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d => d + '€')

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('price', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('price', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(2005) - 2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path.your-line')

c.drawAxis()

yourData = data
  .map(function(d){ return {year: d.year, price: d.price, defined: 0} })
  .filter(function(d){
    if (d.year == 2005) d.defined = true
    return d.year >= 2005
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    var year = clamp(2005, 2022, c.x.invert(pos[0]))
    var price = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.price = price
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1500).attr('width', c.x(2022))
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }
