#!/usr/bin/env python
# coding: utf-8

# In[1]:


import copy
from collections import defaultdict
from functools import lru_cache, reduce
from pprint import pprint
from time import time

import nltk


# In[2]:


with open('../google-10000-english/google-10000-english.txt') as word_file:
    dictionary = set(word_file.read().split())


# In[3]:


MESSAGES = [x.lower() for x in
    [
        'APPF VIBQ KMF EKLC DIM',
        'ZCA LIZIQA PV KMZ X EPLZ PZ PV XK XSCPAUAFAKZ AUAQR EAKAQXZPMK CAYTV FXHA PZV MJK LIZIQA ZCPV PV ZCA AVVAKZPXY SCXYYAKEA ML ZCA TQAVAKZ',
        "X WK DBKZ KBF NRXBM HYKTN CF X WKBN CFHVTQF CJVFPA YJ KNRFQV FEUFONHNXKBV KQ PFN KNRFQV WFAXBF CJ ZKQNR",
        'G NQPBSDKBDX TUN BDQLNR XQ NUPB VQL BPBSVXRUDN VQL FGDX UJ G NQPBSDKBDX TUN BDQLNR XQ XGHB YSQK VQL BPBSVXRUDN VQL RGPB',
    ]
]


# In[4]:


# Ngrams are dictionaries of the triple (ngram, len, i) mapped to a set of
# words of length `len` where the character ngram `ngram` appears at index `i`.
# By including the word length and index in the key we can narrow down word matches later.
ngrams: 'Dict[Tuple[str, int, int], Set[str]]' = defaultdict(set)

# words_by_length is a dictionary of word length to set of words
words_by_length: 'Dict[int, Set[str]]' = defaultdict(set)
    
words_to_rank: 'Dict[str, int]' = defaultdict(lambda: 10_001)

for i, word in enumerate(dictionary):
    words_by_length[len(word)].add(word)
    words_to_rank[word] = i
    for i in range(0, len(word)):
        ngrams[(word[i], len(word), i)].add(word)
        if i < len(word) - 1:
            ngrams[(word[i:i+2], len(word), i)].add(word)
        if i < len(word) - 2:
            ngrams[(word[i:i+3], len(word), i)].add(word)


# In[5]:


words = [w.lower() for w in nltk.corpus.gutenberg.words() if w.isalpha()]
word_bigrams: 'Dict[Tuple[str, str], int]' = defaultdict(int)
for bigram in nltk.bigrams(words):
    word_bigrams[bigram] += 1


# In[6]:


# what fraction of a candidate decoded message's words are found in the dictionary?
#
# `message` should be lowercase
# contractions appear in dictionary without apostrophes e.g. "wont", "shouldnt"
def compute_fraction_in_dictionary(message: str):
    message = ''.join([c for c in message if c.isalpha() or c in (' ', '-')])
    words = message.split()
    in_dict = [w for w in words if w in dictionary]
    return len(in_dict) / len(words)


# In[7]:


# given a cipher and an encrypted message, decode the message
# a cipher is a mapping between 'encrypted' and 'decrypted' characters
def decode(message: str, cipher: 'Dict[str, str]') -> str:
    result = ''
    for char in message:
        if not char.isalpha():
            result += char
        elif char in cipher:
            result += cipher[char]
        else:
            result += '-'
    return result


# In[8]:


# a cipher is valid if values don't repeat
def validate_cipher(cipher: 'Dict[str, str]') -> bool:
    return len(cipher.values()) == len(set(cipher.values()))


# In[9]:


# Higher score is better. Doesn't normalize for message length.
def score_cipher(message: str, cipher: 'Dict[str, str]') -> float:
    decoded_words = decode(message, cipher).split()

    # by word popularity
#     return -1 * sum([words_to_rank[w] for w in decoded_words])

    # by bigram popularity
    bigrams = nltk.bigrams(decoded_words)
    return sum([word_bigrams[b] for b in bigrams])


# In[10]:


@lru_cache(maxsize=None)
def find_words_matching_pattern(template: str) -> 'Set[str]':
    # Given a pattern, return words from dictionary that match. "-" is a wildcard.
    # E.g. "-ood" -> {"good", "hood", ...}
    if template.isalpha():
        return set([template])

    ngram_word_matches: 'List[set]' = []
    # look for decoded ngrams
    for i in range(0, len(template)):
        if template[i].isalpha():
            ngram_word_matches.append(ngrams[(template[i], len(template), i)])
        if i < len(template) - 1 and template[i:i+2].isalpha():
            ngram_word_matches.append(ngrams[(template[i:i+2], len(template), i)])
        if i < len(template) - 2 and template[i:i+3].isalpha():
            ngram_word_matches.append(ngrams[(template[i:i+3], len(template), i)])

    ngram_word_matches = [s for s in ngram_word_matches if len(s) > 0]
    if ngram_word_matches:
        return reduce(lambda a, b: a & b, ngram_word_matches)
    else:
        return words_by_length[len(template)]


# In[11]:


def optimize_cipher(
    message: str,
    cipher: 'Dict[str, str]',
) -> 'List[Tuple[Dict[str, str], float]]':
    # Given a message and an incomplete cipher, return a list of
    # completed ciphers and their scores.
    # Currently doesn't handle any punctuation (periods, apostrophes, etc.)
    if not all([c.isalpha() or c == ' ' for c in message]):
        raise ValueError("Message should only contain letters.")
    message = message.lower()

    possible_new_ciphers = generate_possible_new_ciphers(
        message.split(),
        cipher,
    )
    scored_ciphers = [(cipher, score_cipher(message, cipher)) for cipher in possible_new_ciphers]
    return sorted(scored_ciphers, key=lambda t: t[1], reverse=True)

def generate_possible_new_ciphers(
    message_words: 'List[str]',
    working_cipher: 'Dict[str, str]',
) -> 'List[Dict[str, str]]':
    # For every word we found a bigram in we now have a set of possible decoded words.
    # Each decoded word implies an expanded cipher using the letters that were previously
    # encoded, so we return combinations of non-conflicting ciphers.
    assert(validate_cipher(working_cipher))

    result = []
    possible_word_matches = find_words_matching_pattern(decode(message_words[0], working_cipher))
    for word in possible_word_matches:
        new_cipher = generate_new_cipher(message_words[0], word)
        # a valid cipher will not always be generated: e.g. generate_new_cipher("abcd", "lulu")
        if validate_cipher(new_cipher) and not ciphers_conflict(working_cipher, new_cipher):
            new_cipher.update(working_cipher)
            if len(message_words) == 1:
                result += [new_cipher]
            else:
                result += generate_possible_new_ciphers(
                      message_words[1:],
                      copy.copy(new_cipher),
                  )
    return result


def generate_new_cipher(original_word, decoded_word) -> 'Dict[str, str]':
    # should actually probably only generate parts of the cipher that are new
    assert len(original_word) == len(decoded_word)
    cipher = {}
    for i in range(0, len(original_word)):
        if decoded_word[i] != '-':
            cipher[original_word[i]] = decoded_word[i]
    return cipher

def invert_cipher(cipher: 'Dict[str, str]') -> 'Dict[str, str]':
    return {v: k for k, v in cipher.items()}

def ciphers_conflict(cipher1: 'Dict[str, str]', cipher2: 'Dict[str, str]') -> bool:
    assert(validate_cipher(cipher1) and validate_cipher(cipher2))
    cipher1_inverse = invert_cipher(cipher1)
    for k, v in cipher2.items():
        if (k in cipher1 and v != cipher1[k] or
            v in cipher1_inverse and k != cipher1_inverse[v]):
            return True
    return False

# Is cipher1 a subset of cipher2?
def cipher_is_subset(cipher1: 'Dict[str, str]', cipher2: 'Dict[str, str]') -> bool:
    return all([cipher2.get(k) == cipher1[k] for k in cipher1])


# In[12]:


cipher = {
    'a': 'g',
    'p': 'o',
    'f': 'd',
    'v': 'l',
    'i': 'u',
    'b': 'c',
#     'q': 'k',
#     'k': 'a',
#     'e': 'h',
#     'l': 'v',
#     'c': 'e',
#     'd': 'f',
#     'm': 'n',
}
print(MESSAGES[0])
print(decode(MESSAGES[0], cipher))
scored_ciphers = optimize_cipher(MESSAGES[0], cipher)
pprint([(decode(MESSAGES[0], x[0]), x[1]) for x in scored_ciphers[:10]])


# In[13]:


cipher = {
    'x': 'a',
}

print(MESSAGES[1])
print(decode(MESSAGES[1], cipher))
scored_ciphers = optimize_cipher(MESSAGES[1], cipher)
pprint([(decode(MESSAGES[1], x[0]), x[1]) for x in scored_ciphers[:10]])


# In[14]:


cipher = {
    'x': 'i',
}

print(MESSAGES[2])
print(decode(MESSAGES[2], cipher))
scored_ciphers = optimize_cipher(MESSAGES[2], cipher)
decode(MESSAGES[2], scored_ciphers[0][0])


# In[15]:


cipher = {
    'g': 'a',
}

print(MESSAGES[3])
print(decode(MESSAGES[3], cipher))
scored_ciphers = optimize_cipher(MESSAGES[3], cipher)
pprint([(decode(MESSAGES[3], x[0]), x[1]) for x in scored_ciphers[:5]])

