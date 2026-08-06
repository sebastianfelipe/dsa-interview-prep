# LRU Cache

## Problem

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `LRUCache(capacity)`, `get(key)`, and `put(key, value)` all in O(1) average time. Evict the least recently used key when capacity is exceeded.

## Recognition

O(1) get/put with eviction order → HashMap + doubly linked list (or Map insertion-order trick).

## Key Extract

Keep most-recent at the head. On get/put move node to head. On overflow remove the tail. Map stores key → node for O(1) access.
