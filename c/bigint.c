#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#define MODULO 1000000000
#define _SWAP(a, b) { typeof(a) _SWAP = a; a = b; b = _SWAP; }

typedef struct BigInt {
  // uint8_t sign;
  uint32_t* number; // pointer to the first chunk
  size_t count; // number of used chunks in an array
  size_t size; // amount of all chunks in an array
} BigInt;

static void _swap(uint8_t* arr, size_t size) {
  for (size_t i = 0, j = size - 1; i < size / 2; ++i, --j)
    _SWAP(arr[i], arr[j]);
}

// Increments count depending on BigInt's size
static void _inc_count_bigint(BigInt *x) {
  x->count += 1;
  if (x->count == x->size) {
    x->size <<= 1; // *= 2
    x->number = (uint32_t*)realloc(x->number, x->size * sizeof(uint32_t));
    memset(x->number + x->count, 0, (x->size - x->count) * sizeof(uint32_t));
  }
}

static void _set_count_bigint(BigInt *x, BigInt *y) {
  if (x->size < y->size) {
    x->size = y->size;
    x->number = (uint32_t*)realloc(x->number, x->size * sizeof(uint32_t));
    memset(x->number + x->count, 0, (x->size - x->count) * sizeof(uint32_t));
  }
  if (x->size > y->size) {
    y->size = x->size;
    y->number = (uint32_t*)realloc(y->number, y->size * sizeof(uint32_t));
    memset(y->number + y->count, 0, (y->size - y->count) * sizeof(uint32_t));
  }
  if (x->count < y->count) x->count = y->count;
}

static void _clr_count_bigint(BigInt *x) {
  if (x->count == 0) return;
  size_t i = x->count - 1;

  for (; i > 0; --i) {
    if (x->number != 0) break;
  }
  x->count = i + 1;
}

extern BigInt* new_bigint(uint8_t *str);
extern void free_bigint(BigInt *x);

extern void add_bigint(BigInt *x, BigInt *y);
extern void sub_bigint(BigInt *x, BigInt *y);

extern int8_t cmp_bigint(BigInt *x, BigInt *y);
extern void xchg_bigint(BigInt *x, BigInt *y);

extern void print_bigint(BigInt *x);

int main(void) {
  BigInt *x = new_bigint("1000");
  BigInt *y = new_bigint("50000");

  sub_bigint(x, y);

  printf("x: ");
  print_bigint(x);

  printf("y: ");
  print_bigint(y);

  free_bigint(x);
  free_bigint(y);
  return 0;
}

extern void xchg_bigint(BigInt *x, BigInt *y) {
  _SWAP(*x, *y);
}

extern int8_t cmp_bigint(BigInt *x, BigInt *y) {
  _set_count_bigint(x, y);
  for (int i = x->count - 1; i != -1; --i) {
    if (x->number[i] < y->number[i]) return -1;
    if (x->number[i] > y->number[i]) return 1;
  }
  return 0;
}

extern void print_bigint(BigInt *x) {
  if (x->count == 0) {
    printf("null\n");
    return;
  }

  int i = x->count - 1;
  for (; i > 0; --i) {
    if (x->number[i] != 0) break;
  }
  printf("%u", x->number[i]);
  for (--i; i != -1; --i) printf("%.9u", x->number[i]);
  putchar('\n');
}

extern void add_bigint(BigInt *x, BigInt *y) {
  _set_count_bigint(x, y);
  uint8_t cf = 0; // carry flag

  for (size_t i = 0; i < x->count; ++i) {
    uint64_t temp = cf + x->number[i] + y->number[i];
    x->number[i] = temp % MODULO;
    cf = temp / MODULO;
  }
  if (cf) {
    x->number[x->count] = cf;
    _inc_count_bigint(x);
  }
  _clr_count_bigint(x);
}


extern void sub_bigint(BigInt *x, BigInt *y) {
  if (cmp_bigint(x, y) == -1) xchg_bigint(x, y);
  
  _set_count_bigint(x, y);
  uint8_t cf = 0; // carry flag

  for (size_t i = 0; i < x->count; ++i) {
    uint64_t temp = (MODULO + x->number[i]) - (cf + y->number[i]);
    x->number[i] = temp % MODULO;
    cf = !(temp >= MODULO);
  }
  _clr_count_bigint(x);
}

extern BigInt* new_bigint(uint8_t *str) {
  const size_t BUFFSIZE = 9;

  BigInt* bigint = (BigInt*)malloc(sizeof(BigInt));
  bigint->size   = 10;
  bigint->count  = 0;
  bigint->number = (uint32_t*)malloc(bigint->size * sizeof(uint32_t));

  uint8_t chunk[BUFFSIZE + 1];
  memset(chunk, 0, (BUFFSIZE + 1) * sizeof(uint8_t));

  size_t next = 0;
  size_t index = 0;
  size_t length = strlen(str);

  for (int i = length - 1; i != -1; --i) {
    chunk[index++] = str[i];
    
    if (index == BUFFSIZE) {
      index = 0;
      _swap(chunk, BUFFSIZE);
      bigint->number[next++] = atoi(chunk);
      _inc_count_bigint(bigint);
    }
  }

  if (index != 0) { // if bigint % MODULO != 0
    chunk[index] = '\0';
    _swap(chunk, index);
    bigint->number[next++] = atoi(chunk);
    _inc_count_bigint(bigint); 
  } 

  return bigint;
}

extern void free_bigint(BigInt *x) {
  free(x->number);
  free(x);
}