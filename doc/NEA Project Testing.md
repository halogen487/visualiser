# NEA Project Testing

<address>
Jacob Halleron<br>The Sandon School
</address>

## Single Animation Page

I'll just open the page for a single animation, I expect the page to look just like how I drew it and run any given algorithm as it should. I'm loading `http://localhost/single` in my web browser.

![](/home/jacob/Pictures/Screenshot from 2022-01-11 20-40-08.png)

This is not as expected, for some reason I have comments from the code in my page. Turns out I accidentally put comments inside a string in my code, so I've quickly moved them somewhere more reasonable and it should work now.

After loading the same page:

![](/home/jacob/Pictures/Screenshot from 2022-01-11 21-04-24.png)

It looks appropriate.

## Multiple animation page

I'm loading `http://localhost/multiple` in my browser, I expect there to be an empty page except for the buttons at the top and the "add chart" button.

It looks exactly as expected. After I click the button to add a chart a few times, there are multiple shuffled diagrams on my screen.

![](/home/jacob/Pictures/Screenshot from 2022-01-11 21-07-41.png)

Perfect.

## 404 page

When I load `http://localhost/anything-else`, it should send back a page saying "404: page not found".

![image-20220111211010705](/home/jacob/.config/Typora/typora-user-images/image-20220111211010705.png)

This looks about right.

## Algorithms

I'll open the multiple chart page and run every single algorithm at once, they should all start with the same speed at the same time. Some should finish quicker than others and bogo sort should never finish.

![](/home/jacob/Pictures/Screenshot from 2022-01-11 21-12-48.png)

This screenshot is about 20 seconds after I pressed play and it looks correct. It was also very loud, I had to turn my volume down since they were all beeping and booping at the same time.

## Speed control

I'll run bubble sort on the single animation page and randomly change the speed throughout using the box at the top. It should change speed to whatever I give it.

I don't have any screen recording software and I couldn't print out a video, but it worked flawlessly.

## Size control

I'll do the same test as before, but change the size control. The size of the diagram should switch to whatever I give it while still runnning.

The size changes just fine, but it stops and reshuffles the chart whenever I press enter. I suppose I forgot how I programmed the `setLength` function.