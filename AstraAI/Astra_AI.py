import time
import google.generativeai as genai
import datetime
from data import *
import textwrap
from IPython.display import Markdown
import re


def clean(input_string):
    cleaned_string = ' '.join(input_string.split())
    cleaned_string = re.sub(r'\d+', '', cleaned_string)
    cleaned_string = re.sub(r'[\d\s_]+', '', cleaned_string)
    cleaned_string = re.sub(r'[^\w\s]', '', cleaned_string)
    return cleaned_string.lower()


class AstraAI:
    def __init__(self):
        genai.configure(api_key="AIzaSyBNbm7FuDQ0feLGQXVOmOMlCuEpUJBAA2c")
        self.model = genai.GenerativeModel('gemini-1.0-pro-latest')

    def Choiceoptions(self, text):
        prompt = """Here I have given a question along with a list. 
        Please read the question and select one item from the list.

        my question: '{}'

        1) about_astralinx
        2) achievements
        3) advisory_services
        4) application_transformation_services
        5) application_virtualization
        6) careers
        7) cloud_managed_services
        8) cloud_solutions
        9) cloud_transformation
        10) data_analytics
        11) decode_iot
        12) digital_ai_solutions
        13) digital_infrastructure
        14) diligence_services
        15) emerging_technologies
        16) financial_services_industry
        17) founder_CEO_message
        18) government_sector_industry
        19) inquiries
        20) legal_professional_industry
        21) list_of_services
        22) logistics_industry
        23) managed_security
        24) media_gaming_industry
        25) mergers_and_acquisitions
        26) non_profit_sector_industry
        27) office_locations
        28) pharmaceutical_industry
        29) practices
        30) retail_industry
        31) security_solutions
        32) support
        33) technology_roadmap
        34) unified_communications
        35) widuni
        36) zoho_low_code

        (I don't need an explanation.)

        """

        Choicer = self.model.start_chat()
        result = Choicer.send_message(prompt.format(text))

        choice=None

        for i in data_list:
            if(clean(i) == clean(result.text)):
                choice=i

        if choice is None:
            value = None
        else:
            value = globals()[choice]

        return value

    def FindMatchText(self, choice, question):
        prompt = """Based on the text above, answer my question directly. 
                    If you can't find the answer in the text, respond with 'false' without any further explanation.
                    If you find the answer, provide an answer directly from the text.
                    
                    My question: {}
                    
                    (I don't need an explanation.)
                    """

        if choice is None:
            return "false"

        Comparator = self.model.start_chat()
        Comparator.send_message(choice)
        result = Comparator.send_message(prompt.format(question))

        text = result.text
        text = text.replace('•', '  *')
        text = Markdown(textwrap.indent(text, '<br>', predicate=lambda _: True))

        return text.data

    def time_based_response(self, greeting):
        current_time = datetime.datetime.now()
        current_hour = current_time.hour
        if "morning" in greeting.lower() or "afternoon" in greeting.lower() or "evening" in greeting.lower():
            if 5 <= current_hour < 12:
                return "Good morning! How can I assist you?"
            elif 12 <= current_hour < 17:
                return "Good afternoon! How can I assist you?"
            elif 17 <= current_hour:
                return "Good evening! How can I assist you?"
            
        elif "night" in greeting.lower():
            return "Good night!.."
        elif "hi" in greeting.lower():
            return "Hi! How can I assist you?"
        elif "hello" in greeting.lower():
            return "Hello! How can I assist you?"
        else:
            return "At the moment, I am unable to provide an answer to your question. However,I suggest that you " \
                   "contact Astralinx support for assistance. I will provide their email address for you. Please send " \
                   "your inquiry to 'support@atralinx.com' (or) Please visit the support site \n " \
                   "'https://www.astralinx.com/support'"

    def ChatCorrection(self, text):
        prompt = """Please correct the grammar and spelling mistakes in the following sentence. 
                '{}'
                (I don't need an explanation.)"""
        Corrector = self.model.start_chat()
        result = Corrector.send_message(prompt.format(text))
        return result.text

    def process_query_text(self, text):
        Choice = self.Choiceoptions(text)
        result = self.FindMatchText(Choice, text)
        if "false" in result.lower():
            return self.time_based_response(self.ChatCorrection(text))
        else:
            return result.replace("**", "")


if __name__ == '__main__':
    AI = AstraAI()
    while (1):
        text = input("User: ")

        start = time.time()
        result = AI.process_query_text(text)
        end = time.time()

        print("Astra AI:", result)
        print("The time: ", end - start)
