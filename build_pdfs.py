from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

def create_pdf(filename, title, content):
    doc = SimpleDocTemplate(f"public/stories/{filename}", pagesize=letter)
    styles = getSampleStyleSheet()
    
    title_style = styles['Heading1']
    title_style.alignment = 1  # Center
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=24,
        spaceBefore=12,
        spaceAfter=12
    )

    story = []
    
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 0.5 * inch))
    
    for paragraph in content.split('\n\n'):
        if paragraph.strip():
            story.append(Paragraph(paragraph.strip(), body_style))
            
    doc.build(story)

rainbow_passage = """
When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it. When a man looks for something beyond his reach, his friends say he is looking for the pot of gold at the end of the rainbow.

Throughout the centuries people have explained the rainbow in various ways. Some have accepted it as a miracle without physical explanation. To the Hebrews it was a token that there would be no more universal floods. The Greeks used to imagine that it was a sign from the gods to foretell war or heavy rain. The Norsemen considered the rainbow as a bridge over which the gods passed from earth to their home in the sky. Others have tried to explain the phenomenon physically. Aristotle thought that the rainbow was caused by reflection of the sun's rays by the rain. Since then physicists have found that it is not reflection, but refraction by the raindrops which causes the rainbows. Many complicated ideas about the rainbow have been formed. The difference in the rainbow depends considerably upon the size of the drops, and the width of the colored band increases as the size of the drops increases. The actual primary rainbow observed is said to be the effect of super-imposition of a number of bows. If the red of the second bow falls upon the green of the first, the result is to give a bow with an abnormally wide yellow band, since red and green light when mixed form yellow. This is a very common type of bow, one showing mainly red and yellow, with little or no green or blue.
"""

grandfather_passage = """
You wished to know all about my grandfather. Well, he is nearly ninety-three years old; he dresses himself in an ancient black frock coat, usually minus several buttons; yet he still thinks as swiftly as ever. A long, flowing beard clings to his chin, giving those who observe him a pronounced feeling of the utmost respect. When he speaks, his voice is just a bit cracked and quivers a trifle. Twice each day he plays skillfully and with zest upon our small organ. Except in the winter when the oozing snow or ice prevents, he slowly takes a short walk in the open air each day. We have often urged him to walk more and smoke less, but he always answers, "Banana oil!" Grandfather likes to be modern in his language.
"""

arthur_passage = """
Once upon a time there was a young rat named Arthur, who could never take the trouble to make up his mind. Whenever his friends asked him if he would like to go out with them, he would only answer, "I don't know." He wouldn't say "yes" or "no" either. He would always shirk making a choice. His aunt Helen said to him: "Now look here! No one is going to care for you if you carry on like this. You have no more mind than a blade of grass."

One rainy day, the rats heard a great noise in the loft. The pine rafters were all rotten, and at last the barn gave way and fell to the ground. The walls shook and all the rats' hair stood on end with fear and horror. "This won't do," said the captain. "I'll send out scouts to search for a new home." Within five hours the ten scouts came back and said they had found an old coop of a barn where there would be room and board for them all. Then the captain gave the order: "Form in line!"

The rats crawled out of their holes and stood on the floor in a long line. Just then the old rat saw Arthur. "Stop," he ordered coarsely. "You are coming, of course?" "I'm not certain," said Arthur, undaunted. "The roof may not come down yet." "Well," said the angry old rat, "we can't wait for you to join us. Right about face. March!" Arthur stood and watched them hurry away. "I think I'll go tomorrow," he calmly said to himself, but then again "I don't know; it's so nice and snug here." That night there was a big crash. In the morning some men—with some boys and dogs—came to clear out the barn. They found Arthur dead under some planks.
"""

try:
    create_pdf("arthur.pdf", "Arthur The Rat (Phonetic Practice)", arthur_passage)
    print("Created arthur.pdf (Arthur The Rat)")
except Exception as e:
    print(f"Error: {e}")
