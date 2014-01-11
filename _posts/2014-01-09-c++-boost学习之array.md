---
layout:	post
category: cpp
tags: [boost,array]
---

###参考资料;

[官方文档](http://www.boost.org/doc/libs/1_55_0/doc/html/array.html)

[Boost:array介绍](http://blog.csdn.net/bichenggui/article/details/4190418)

[boost 学习笔记：array](http://dozb.bokee.com/1976512.html)

###简介

boost.array 是固定长度的数组

###为什么要选择固定大小的数组

虽然STL提供了vector动态数组，但是开销比原来的静态数组要大，这对于一部分人来说是无法忍受的，而c++本身的静态数组支持的操作又不能满足。
boost.array应运而生

###引用头文件

`<boost/array.hpp>`

###Array头文件声明

```c++

template<typename T, std::size_t N> 
class array {
public:
  // types
  typedef T                                     value_type;            
  typedef T*                                    iterator;              
  typedef const T*                              const_iterator;        
  typedef std::reverse_iterator<iterator>       reverse_iterator;      
  typedef std::reverse_iterator<const_iterator> const_reverse_iterator;
  typedef T&                                    reference;             
  typedef const T&                              const_reference;       
  typedef std::size_t                           size_type;             
  typedef std::ptrdiff_t                        difference_type;       

  // static constants
  static const size_type static_size = N;

  // construct/copy/destruct
  template<typename U> array& operator=(const array<U, N>&);

  // iterator support
  iterator begin();
  const_iterator begin() const;
  iterator end();
  const_iterator end() const;

  // reverse iterator support
  reverse_iterator rbegin();
  const_reverse_iterator rbegin() const;
  reverse_iterator rend();
  const_reverse_iterator rend() const;

  // capacity
  size_type size();
  bool empty();
  size_type max_size();

  // element access
  reference operator[](size_type);
  const_reference operator[](size_type) const;
  reference at(size_type);
  const_reference at(size_type) const;
  reference front();
  const_reference front() const;
  reference back();
  const_reference back() const;
  const T* data() const;
  T* c_array();

  // modifiers
  void swap(array<T, N>&);
  void assign(const T&);
  T elems[N];
};

// specialized algorithms
template<typename T, std::size_t N> void swap(array<T, N>&, array<T, N>&);

// comparisons
template<typename T, std::size_t N> 
  bool operator==(const array<T, N>&, const array<T, N>&);
template<typename T, std::size_t N> 
  bool operator!=(const array<T, N>&, const array<T, N>&);
template<typename T, std::size_t N> 
  bool operator<(const array<T, N>&, const array<T, N>&);
template<typename T, std::size_t N> 
  bool operator>(const array<T, N>&, const array<T, N>&);
template<typename T, std::size_t N> 
  bool operator<=(const array<T, N>&, const array<T, N>&);
template<typename T, std::size_t N> 
  bool operator>=(const array<T, N>&, const array<T, N>&);

```

###基本用法

[官方文档](http://www.boost.org/doc/libs/1_55_0/doc/html/boost/array.html)说得很清楚了

###值得注意的地方

>array提供了data()和c_array()成员函数，data返回const T*，c_array返回T*，都返回c++形式的数组，但是注意data是const的成员函数，c_array不是。

###代码练习

```c++
/**
 * C/C++ File
 *Filename: baseUse.cpp
 *Created: 2014-01-09 18:25:24
 *Author: Myon, myon.cn@gmail.com
 *Desc: boost.Array的基本用法
 */

#include <boost/array.hpp>
#include <iostream>
#include <cstring>
int main()
{
	boost::array<int,10> arr1 = {{1,2,3,4,5,6,7,8,9,19}};		//定义一个10个元素的int型数组,并初始化
	//front() 数组第一个元素
	std::cout<<"front():"
		<<arr1.front()<<std::endl;
	//back() 数组最后一个元素
	std::cout<<"back():"
		<<arr1.back()<<std::endl;

	boost::array<int,10>::iterator itr;		//迭代器用于遍历
	//正向迭代器遍历
	//迭代器begin()和end()的使用，begin指向第一个元素，end指向最后一个元素的后一位
	std::cout<<"正向遍历：";
	for(itr=arr1.begin();itr!=arr1.end();itr++)
	{
		std::cout<<*itr<<" ";
	}
	std::cout<<std::endl;

	//反向迭代器遍历
	//反向迭代器rbegin和rend，rbegin只想最后一位，rend指向第一位的前一位
	boost::array<int,10>::reverse_iterator r_itr;		//迭代器用于遍历
	std::cout<<"反向遍历：";
	for(r_itr=arr1.rbegin();r_itr!=arr1.rend();r_itr++)
	{
		std::cout<<*r_itr<<" ";
	}
	std::cout<<std::endl;

	//size()获得数组大小
	std::cout<<"size():"<<arr1.size()<<std::endl;
	//empty()判断是否是空数组
	std::cout<<"arr1 empty():"<<arr1.empty()<<std::endl;
	boost::array<double,0> arr2;
	std::cout<<"arr1 empty():"<<arr2.empty()<<std::endl;
	std::cout<<"max_size():"<<arr1.max_size()<<std::endl;

	//[]操作符
	arr1[1] = 555;
	std::cout<<arr1[1]<<std::endl;
	//at(n) 返回第n个元素,n从0开始
	std::cout<<"arr1.at(5):"<<arr1.at(5)<<std::endl;
	//data() 返回c++形式的const数组,和c_array一样，不过后者返回的不是const的
	boost::array<char,10> charArr = {"testadw"};
	const char * temp=charArr.data();	
	std::cout<<"使用data()转换成c++形式的数组"<<temp<<std::endl;
	
	//swap() ,和另一个array交换
	boost::array<double,3> swp1 = {{11,22,33}};
	boost::array<double,3> swp2 = {{44,55,66}};
	swp1.swap(swp2);
	std::cout<<"swp1.swap(swp2):";
	for(size_t i=0;i<swp1.size();i++)
	{
		std::cout<<swp1[i];
	}
	std::cout<<std::endl;

	//assign,给array批量分配值
	swp1.assign(1);
	std::cout<<"swp1.assign(1):";
	for(size_t i=0;i<swp1.size();i++)
	{
		std::cout<<swp1[i];
	}
	std::cout<<std::endl;

	//> < == 用于比较字符数组大小
	boost::array<char,10> c1 = {"ddsjfkj"};
	boost::array<char,10> c2 = {"cdsjfkj"};
	std::cout<<"c1<c2:";
	std::cout<<(c1<c2);

	return 0;
}
```

