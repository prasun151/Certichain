from algosdk import wordlist

def check_words(phrase_24):
    valid_words = wordlist.word_list_raw().split(",")
    valid_words = [w.strip() for w in valid_words]
    words_in_phrase = phrase_24.split()
    
    invalid = []
    for w in words_in_phrase:
        if w not in valid_words:
            invalid.append(w)
    return invalid

phrase_24 = "rack group letter catalog news example romance ring seven girl dynamic someone advice midnight blind twice chef rigid sheriff pen episode such pool wasp"
invalid = check_words(phrase_24)
print(f"Invalid words: {invalid}")
