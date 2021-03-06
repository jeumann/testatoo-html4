/**
 * Copyright (C) 2008 Ovea <dev@testatoo.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.testatoo.cartridge.html4.element;

import org.junit.BeforeClass;
import org.junit.Test;
import org.testatoo.WebTest;
import org.testatoo.core.ComponentException;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.fail;
import static org.testatoo.cartridge.html4.By.$;
import static org.testatoo.core.ComponentFactory.*;
import static org.testatoo.core.Language.assertThat;
import static org.testatoo.core.matcher.Matchers.*;

public class OptionTest extends WebTest {

    @BeforeClass
    public static void setUp() {
        page().open("Option.html");
    }

    @Test
    public void can_find_option_by_id() {
        component(Option.class, $("#1"));

        try {
            component(Option.class, $("#someOption"));
            fail();
        } catch (ComponentException e) {
            assertThat(e.getMessage(), is("Cannot find component defined by jQueryExpression=$('#someOption')"));
        }
    }

    @Test
    public void exception_thrown_if_component_not_a_html_option() {
        try {
            component(Option.class, $("#country"));
            fail();
        } catch (ComponentException e) {
            assertThat(e.getMessage(), is("The component with id=country is not a Option but a DropDown"));
        }
    }

    @Test
    public void can_test_value() {
        assertThat(component(Option.class, $("#1")), has(value("Canada_country")));
    }

    @Test
    public void can_retrieve_the_content() {
        assertThat(component(Option.class, $("#1")).content(), is("Canada (CA)"));
    }

    @Test
    public void test_label() {
        assertThat(component(Option.class, $("#1")), has(label("Canada")));
    }

    @Test
    public void can_test_is_selected() {
        assertThat(component(Option.class, $("#1")).selected(), is(true));
        assertThat(component(Option.class, $("#2")).selected(), is(false));
    }

    @Test
    public void test_enability() {
        assertThat(component(Option.class, $("#1")), is(not(disabled())));
        assertThat(component(Option.class, $("#2")), is(disabled()));
    }

    @Test
    public void test_i18nAttributes() {
        assertThat(component(Option.class, $("#2")).direction(), is(Direction.righttoleft));
        assertThat(component(Option.class, $("#2")).language(), is("fr"));
    }

    @Test
    public void test_coreAttributes() {
        Option my2 = component(Option.class, $("#2"));
        assertThat(my2.id(), is("2"));
        assertThat(my2.classname(), is("myClass"));
        assertThat(my2.style(), containsString("color:black"));
        assertThat(my2.title(), is("optionTitle"));
    }

    @Test
    public void test_toString() {
        assertThat(component(Option.class, $("#2")).toString(),
                is("class org.testatoo.cartridge.html4.element.Option with state : enabled:false, visible:true, value:France_country, label:France, text:France (FR), selected:false"));
    }

}
